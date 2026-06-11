# ADR-003: Choice of Hono for HTTP Framework

## Status

Accepted

## Context

We need an HTTP framework for Cloudflare Workers that provides:
- Fast performance
- TypeScript support
- Middleware support
- Good documentation

## Decision

We will use Hono as the HTTP framework.

## Consequences

### Positive
- Extremely fast (built for edge)
- First-class Cloudflare Workers support
- Built-in middleware (CORS, JWT, etc.)
- TypeScript-first
- Small bundle size

### Negative
- Smaller ecosystem than Express
- Less middleware available
- Newer project

## Alternatives Considered

- **itty-router**: Good but less features
- **worktop**: Less maintained
- **Express**: Too heavy for Workers
