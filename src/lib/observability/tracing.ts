export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: string;
  endTime?: string;
  attributes: Record<string, string | number | boolean>;
}

export class Tracer {
  private traceId: string;
  private spans: TraceSpan[] = [];

  constructor() {
    this.traceId = crypto.randomUUID().replace(/-/g, '');
  }

  startSpan(name: string, parentSpanId?: string): TraceSpan {
    const span: TraceSpan = {
      traceId: this.traceId,
      spanId: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      parentSpanId,
      name,
      startTime: new Date().toISOString(),
      attributes: {},
    };

    this.spans.push(span);
    return span;
  }

  endSpan(spanId: string): void {
    const span = this.spans.find((s) => s.spanId === spanId);
    if (span) {
      span.endTime = new Date().toISOString();
    }
  }

  setAttribute(spanId: string, key: string, value: string | number | boolean): void {
    const span = this.spans.find((s) => s.spanId === spanId);
    if (span) {
      span.attributes[key] = value;
    }
  }

  getSpans(): TraceSpan[] {
    return [...this.spans];
  }

  getTraceId(): string {
    return this.traceId;
  }
}

export interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: string;
}

const metrics: Metric[] = [];

export function recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
  metrics.push({
    name,
    value,
    tags,
    timestamp: new Date().toISOString(),
  });
}

export function getMetrics(): Metric[] {
  return [...metrics];
}

export function clearMetrics(): void {
  metrics.length = 0;
}
