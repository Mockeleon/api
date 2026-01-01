import { Counter, Gauge, Histogram, Registry } from 'prom-client';

/**
 * Prometheus metrics service
 * Tracks API usage, performance, and rate limiting
 */
class MetricsService {
  public readonly registry: Registry;

  public readonly requestDuration: Histogram<string>;

  public readonly recordsGenerated: Counter<string>;

  public readonly rateLimitHits: Counter<string>;

  public readonly activeRequests: Gauge<string>;

  public readonly httpRequests: Counter<string>;

  constructor() {
    this.registry = new Registry();

    this.requestDuration = new Histogram({
      name: 'mockeleon_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.recordsGenerated = new Counter({
      name: 'mockeleon_records_generated_total',
      help: 'Total number of mock data records generated',
      registers: [this.registry],
    });

    this.rateLimitHits = new Counter({
      name: 'mockeleon_rate_limit_hits_total',
      help: 'Total number of requests rejected due to rate limiting',
      registers: [this.registry],
    });

    this.activeRequests = new Gauge({
      name: 'mockeleon_active_requests',
      help: 'Number of currently active HTTP requests',
      registers: [this.registry],
    });

    this.httpRequests = new Counter({
      name: 'mockeleon_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.registry.setDefaultLabels({
      app: 'mockeleon-api',
    });
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }

  async getMetricsJSON(): Promise<unknown> {
    return await this.registry.getMetricsAsJSON();
  }
}

export const metricsService = new MetricsService();
