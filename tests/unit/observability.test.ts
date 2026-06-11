import { describe, it, expect } from 'vitest';
import {
  Tracer,
  recordMetric,
  getMetrics,
  clearMetrics,
} from '../../src/lib/observability/tracing';

describe('Observability', () => {
  describe('Tracer', () => {
    it('should create a tracer with trace ID', () => {
      const tracer = new Tracer();
      expect(tracer.getTraceId()).toBeDefined();
      expect(tracer.getTraceId().length).toBe(32);
    });

    it('should start and end spans', () => {
      const tracer = new Tracer();
      const span = tracer.startSpan('test-span');
      expect(span.traceId).toBe(tracer.getTraceId());
      expect(span.name).toBe('test-span');

      tracer.endSpan(span.spanId);
      const spans = tracer.getSpans();
      expect(spans[0].endTime).toBeDefined();
    });

    it('should set attributes', () => {
      const tracer = new Tracer();
      const span = tracer.startSpan('test-span');
      tracer.setAttribute(span.spanId, 'key', 'value');

      const spans = tracer.getSpans();
      expect(spans[0].attributes.key).toBe('value');
    });
  });

  describe('Metrics', () => {
    it('should record and retrieve metrics', () => {
      clearMetrics();
      recordMetric('test.metric', 42, { env: 'test' });

      const metrics = getMetrics();
      expect(metrics.length).toBe(1);
      expect(metrics[0].name).toBe('test.metric');
      expect(metrics[0].value).toBe(42);
    });

    it('should clear metrics', () => {
      recordMetric('test.metric', 1, {});
      clearMetrics();
      expect(getMetrics().length).toBe(0);
    });
  });
});
