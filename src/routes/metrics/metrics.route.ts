import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';

import { config } from '../../config/index.js';
import { metricsService } from '../../services/metrics.service.js';

const METRICS_TAG = 'Metrics';

interface MetricsData {
  recordsGenerated: number;
  totalRequests: number;
  rateLimitHits: number;
  activeRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number | string;
  successRate: number | string;
  rateLimitRate: number | string;
  endpointStats: Array<{
    method: string;
    route: string;
    count: number;
    statusCode: string;
  }>;
  errorStats: Array<{ statusCode: string; count: number; percentage: number }>;
}

const metricsRoute = createRoute({
  method: 'get',
  path: '/metrics',
  tags: [METRICS_TAG],
  summary: 'Get metrics dashboard',
  description:
    'Returns a human-readable HTML dashboard with application metrics and statistics',
  responses: {
    200: {
      description: 'HTML metrics dashboard',
      content: {
        'text/html': {
          schema: z.string().openapi({
            description: 'Interactive HTML dashboard showing real-time metrics',
          }),
        },
      },
    },
  },
});

function generateDashboardHTML(metricsData: MetricsData): string {
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mockeleon API - Metrics</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 { margin: 0 0 30px 0; color: #333; }
        
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .stat.success { border-left-color: #10b981; }
        .stat.warning { border-left-color: #f59e0b; }
        .stat.danger { border-left-color: #ef4444; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
        .stat-value { font-size: 32px; font-weight: bold; color: #111; }
        .stat-desc { font-size: 13px; color: #888; margin-top: 5px; }
        
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; }
        .info-box h2 { font-size: 18px; margin: 0 0 20px 0; color: #333; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #666; font-weight: 500; }
        .info-value { color: #111; font-family: monospace; }
        
        .footer { text-align: center; color: #666; font-size: 13px; margin-top: 30px; padding: 20px; background: white; border-radius: 8px; }
        .footer a { color: #3b82f6; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Mockeleon API - Metrics Dashboard</h1>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-label">Total Records</div>
                <div class="stat-value">${metricsData.recordsGenerated.toLocaleString('en-US')}</div>
                <div class="stat-desc">Mock data records generated</div>
            </div>
            <div class="stat success">
                <div class="stat-label">Total Requests</div>
                <div class="stat-value">${metricsData.totalRequests.toLocaleString('en-US')}</div>
                <div class="stat-desc">HTTP requests processed</div>
            </div>
            <div class="stat warning">
                <div class="stat-label">Rate Limited</div>
                <div class="stat-value">${metricsData.rateLimitHits.toLocaleString('en-US')}</div>
                <div class="stat-desc">Requests blocked</div>
            </div>
            <div class="stat">
                <div class="stat-label">Active Requests</div>
                <div class="stat-value">${metricsData.activeRequests}</div>
                <div class="stat-desc">Currently processing</div>
            </div>
            <div class="stat success">
                <div class="stat-label">Successful</div>
                <div class="stat-value">${metricsData.successfulRequests.toLocaleString('en-US')}</div>
                <div class="stat-desc">2xx responses</div>
            </div>
            <div class="stat danger">
                <div class="stat-label">Failed</div>
                <div class="stat-value">${metricsData.failedRequests.toLocaleString('en-US')}</div>
                <div class="stat-desc">4xx-5xx responses</div>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-box">
                <h2>System Information</h2>
                <div class="info-row">
                    <span class="info-label">Uptime</span>
                    <span class="info-value">${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Node.js</span>
                    <span class="info-value">${process.version}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Platform</span>
                    <span class="info-value">${process.platform}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Memory</span>
                    <span class="info-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Environment</span>
                    <span class="info-value">${config.server.env}</span>
                </div>
            </div>
            
            <div class="info-box">
                <h2>Performance Metrics</h2>
                <div class="info-row">
                    <span class="info-label">Avg Response Time</span>
                    <span class="info-value">${metricsData.avgResponseTime} ms</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Success Rate</span>
                    <span class="info-value">${metricsData.successRate}%</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Rate Limit Rate</span>
                    <span class="info-value">${metricsData.rateLimitRate}%</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Requests/Record</span>
                    <span class="info-value">${metricsData.totalRequests > 0 ? (metricsData.totalRequests / Math.max(1, metricsData.recordsGenerated)).toFixed(2) : 'N/A'}</span>
                </div>
            </div>
            
            <div class="info-box">
                <h2>Request Distribution</h2>
                <div class="info-row">
                    <span class="info-label">Successful Requests</span>
                    <span class="info-value">${metricsData.successfulRequests.toLocaleString('en-US')} (${metricsData.successRate}%)</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Failed Requests</span>
                    <span class="info-value">${metricsData.failedRequests.toLocaleString('en-US')} (${metricsData.totalRequests > 0 ? Math.round((metricsData.failedRequests / metricsData.totalRequests) * 100) : 0}%)</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Rate Limited</span>
                    <span class="info-value">${metricsData.rateLimitHits.toLocaleString('en-US')} (${metricsData.rateLimitRate}%)</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Records/Request</span>
                    <span class="info-value">${metricsData.recordsGenerated > 0 ? (metricsData.recordsGenerated / Math.max(1, metricsData.totalRequests)).toFixed(2) : 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-box">
                <h2>Endpoint Statistics</h2>
                ${
                  metricsData.endpointStats.length > 0
                    ? metricsData.endpointStats
                        .slice(0, 10)
                        .map(
                          (stat) => `
                <div class="info-row">
                    <span class="info-label">${stat.method} ${stat.route}</span>
                    <span class="info-value">${stat.count.toLocaleString('en-US')} (${stat.statusCode})</span>
                </div>`
                        )
                        .join('')
                    : '<div class="info-row"><span class="info-label">No requests yet</span></div>'
                }
            </div>
            
            <div class="info-box">
                <h2>Error Distribution</h2>
                ${
                  metricsData.errorStats.length > 0
                    ? metricsData.errorStats
                        .map(
                          (stat) => `
                <div class="info-row">
                    <span class="info-label">HTTP ${stat.statusCode}</span>
                    <span class="info-value">${stat.count.toLocaleString('en-US')} (${stat.percentage}%)</span>
                </div>`
                        )
                        .join('')
                    : '<div class="info-row"><span class="info-label">No errors yet</span></div>'
                }
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Mockeleon API v1.0.0</strong> | Last updated: ${new Date().toLocaleString('en-US')}</p>
            <p style="margin-top: 10px;">Auto-refresh every 10 seconds</p>
        </div>
    </div>
    <script>setTimeout(() => window.location.reload(), 10000);</script>
</body>
</html>`;
}

export function registerMetricsRoutes(app: OpenAPIHono) {
  app.openapi(metricsRoute, async (c) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metricsJson: any = await metricsService.getMetricsJSON();

    const metricsData: MetricsData = {
      recordsGenerated: 0,
      totalRequests: 0,
      rateLimitHits: 0,
      activeRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 'N/A',
      successRate: 'N/A',
      rateLimitRate: 'N/A',
      endpointStats: [],
      errorStats: [],
    };

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
    metricsJson.forEach((metric: any) => {
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
        metric.values?.forEach((v: any) => {
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
        const sumMetric = metric.values.find((v: any) =>
          v.metricName?.includes('_sum')
        );
        const countMetric = metric.values.find((v: any) =>
          v.metricName?.includes('_count')
        );
        if (sumMetric && countMetric && countMetric.value > 0) {
          metricsData.avgResponseTime = Math.round(
            (sumMetric.value / countMetric.value) * 1000
          );
        }
      }
    });
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

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

    const html = generateDashboardHTML(metricsData);
    return c.html(html);
  });
}
