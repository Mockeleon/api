import { Counter, Gauge, Histogram, Registry } from 'prom-client';

/**
 * Prometheus metrics service
 * Tracks API usage, performance, and rate limiting
 */
class MetricsService {
  public readonly registry: Registry;

  // Request duration histogram (tracks p50, p95, p99)
  public readonly requestDuration: Histogram<string>;

  // Total number of records generated
  public readonly recordsGenerated: Counter<string>;

  // Rate limit hits counter
  public readonly rateLimitHits: Counter<string>;

  // Active requests gauge
  public readonly activeRequests: Gauge<string>;

  // HTTP requests counter
  public readonly httpRequests: Counter<string>;

  constructor() {
    // Create a new registry
    this.registry = new Registry();

    // HTTP request duration histogram (in seconds)
    this.requestDuration = new Histogram({
      name: 'mockeleon_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5], // 10ms to 5s
      registers: [this.registry],
    });

    // Total records generated counter
    this.recordsGenerated = new Counter({
      name: 'mockeleon_records_generated_total',
      help: 'Total number of mock data records generated',
      registers: [this.registry],
    });

    // Rate limit hits counter
    this.rateLimitHits = new Counter({
      name: 'mockeleon_rate_limit_hits_total',
      help: 'Total number of requests rejected due to rate limiting',
      registers: [this.registry],
    });

    // Active requests gauge
    this.activeRequests = new Gauge({
      name: 'mockeleon_active_requests',
      help: 'Number of currently active HTTP requests',
      registers: [this.registry],
    });

    // HTTP requests counter
    this.httpRequests = new Counter({
      name: 'mockeleon_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    // Register default metrics (CPU, memory, etc.)
    this.registry.setDefaultLabels({
      app: 'mockeleon-api',
    });
  }

  /**
   * Get metrics in Prometheus text format
   */
  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }

  /**
   * Get metrics as JSON (for debugging)
   */
  async getMetricsJSON(): Promise<unknown> {
    return await this.registry.getMetricsAsJSON();
  }
}

// Singleton instance
export const metricsService = new MetricsService();
