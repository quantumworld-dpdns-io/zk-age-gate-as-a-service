# ADR-001: Choice of Cloudflare Workers

## Status

Accepted

## Context

We need a serverless runtime for the API layer that provides:
- Global edge deployment
- Low latency
- Built-in storage solutions
- Security features

## Decision

We will use Cloudflare Workers as the primary runtime.

## Consequences

### Positive
- Global edge deployment with <50ms latency
- Built-in D1, KV, R2, Vectorize storage
- Cloudflare security features (WAF, Turnstile)
- Cost-effective at scale
- TypeScript support

### Negative
- Vendor lock-in to Cloudflare
- Limited runtime compared to Node.js
- 128MB memory limit
- 30s CPU time limit

## Alternatives Considered

- **AWS Lambda**: More mature but higher latency
- **Vercel Edge Functions**: Less storage options
- **Deno Deploy**: Less ecosystem integration
