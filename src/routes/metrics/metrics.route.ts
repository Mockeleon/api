import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';

import { config } from '../../config/index.js';
import { metricsService } from '../../services/metrics.service.js';

import {
  MetricsResponseSchema,
  METRICS_TAG,
  METRICS_SUMMARY,
} from './metrics.schema.js';
import type {
  MetricsResponse,
  PrometheusMetric,
  PrometheusMetricValue,
} from './metrics.types.js';

const metricsRoute = createRoute({
  method: 'get',
  path: '/metrics',
  tags: [METRICS_TAG],
  summary: METRICS_SUMMARY,
  description:
    'Returns application metrics and statistics in JSON format including request counts, response times, error rates, and system information',
  responses: {
    200: {
      description: 'Application metrics retrieved successfully',
      content: {
        'application/json': {
          schema: MetricsResponseSchema,
        },
      },
    },
  },
});

export function registerMetricsRoutes(app: OpenAPIHono) {
  app.openapi(metricsRoute, async (c) => {
    const metricsJson = await metricsService.getMetricsJSON();

    const uptime = process.uptime();

    const metricsData: MetricsResponse = {
      recordsGenerated: 0,
      totalRequests: 0,
      rateLimitHits: 0,
      activeRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 'N/A',
      successRate: 'N/A',
      rateLimitRate: 'N/A',
      uptime: {
        hours: Math.floor(uptime / 3600),
        minutes: Math.floor((uptime % 3600) / 60),
        seconds: Math.floor(uptime % 60),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        environment: config.server.env,
      },
      endpointStats: [],
      errorStats: [],
    };

    (metricsJson as PrometheusMetric[]).forEach((metric) => {
      if (
        metric.name === 'mockeleon_records_generated_total' &&
        metric.values?.[0]
      ) {
        metricsData.recordsGenerated = Math.round(metric.values[0].value);
      } else if (
        metric.name === 'mockeleon_rate_limit_hits_total' &&
        metric.values?.[0]
      ) {
        metricsData.rateLimitHits = Math.round(metric.values[0].value);
      } else if (
        metric.name === 'mockeleon_active_requests' &&
        metric.values?.[0]
      ) {
        metricsData.activeRequests = Math.round(metric.values[0].value);
      } else if (metric.name === 'mockeleon_http_requests_total') {
        metric.values?.forEach((v: PrometheusMetricValue) => {
          const value = Math.round(v.value);
          metricsData.totalRequests += value;
          const statusCode = parseInt(v.labels?.status_code || '0');
          const method = v.labels?.method || 'UNKNOWN';
          const route = v.labels?.route || 'UNKNOWN';

          // Collect endpoint stats
          metricsData.endpointStats.push({
            method,
            route,
            count: value,
            statusCode: v.labels?.status_code || 'N/A',
          });

          if (statusCode >= 200 && statusCode < 300) {
            metricsData.successfulRequests += value;
          } else if (statusCode >= 400) {
            metricsData.failedRequests += value;
          }
        });
      } else if (
        metric.name === 'mockeleon_request_duration_seconds' &&
        metric.values
      ) {
        const sumMetric = metric.values.find((v: PrometheusMetricValue) =>
          v.metricName?.includes('_sum')
        );
        const countMetric = metric.values.find((v: PrometheusMetricValue) =>
          v.metricName?.includes('_count')
        );
        if (sumMetric && countMetric && countMetric.value > 0) {
          metricsData.avgResponseTime = Math.round(
            (sumMetric.value / countMetric.value) * 1000
          );
        }
      }
    });
    if (metricsData.totalRequests > 0) {
      metricsData.successRate = Math.round(
        (metricsData.successfulRequests / metricsData.totalRequests) * 100
      );
      metricsData.rateLimitRate = Math.round(
        (metricsData.rateLimitHits / metricsData.totalRequests) * 100
      );
    }

    // Calculate error statistics
    const errorMap = new Map<string, number>();
    metricsData.endpointStats.forEach((stat) => {
      const code = parseInt(stat.statusCode);
      if (code >= 400) {
        const count = errorMap.get(stat.statusCode) || 0;
        errorMap.set(stat.statusCode, count + stat.count);
      }
    });

    const totalErrors = Array.from(errorMap.values()).reduce(
      (a, b) => a + b,
      0
    );
    metricsData.errorStats = Array.from(errorMap.entries())
      .map(([statusCode, count]) => ({
        statusCode,
        count,
        percentage:
          totalErrors > 0 ? Math.round((count / totalErrors) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return c.json(metricsData, 200);
  });
}
