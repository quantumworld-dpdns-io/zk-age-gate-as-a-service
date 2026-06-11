# ADR-004: Choice of D1 for SQL Storage

## Status

Accepted

## Context

We need a relational database that:
- Works with Cloudflare Workers
- Supports SQL
- Is globally distributed
- Has good performance

## Decision

We will use Cloudflare D1 (SQLite) as the primary relational database.

## Consequences

### Positive
- Native Cloudflare Workers integration
- SQL interface
- Globally distributed
- Automatic backups
- Point-in-time recovery

### Negative
- SQLite limitations (no stored procedures)
- Newer service (less battle-tested)
- Limited querying capabilities compared to PostgreSQL

## Alternatives Considered

- **Hyperdrive + PostgreSQL**: More features but more complexity
- **PlanetScale**: Good but external service
- **Turso**: Good but less integration
