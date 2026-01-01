import type { z } from '@hono/zod-openapi';

import { type MetricsResponseSchema } from './metrics.schema.js';

export type MetricsResponse = z.infer<typeof MetricsResponseSchema>;

export interface PrometheusMetricValue {
  value: number;
  labels?: {
    method?: string;
    route?: string;
    status_code?: string;
  };
  metricName?: string;
}

export interface PrometheusMetric {
  name: string;
  values?: PrometheusMetricValue[];
}
