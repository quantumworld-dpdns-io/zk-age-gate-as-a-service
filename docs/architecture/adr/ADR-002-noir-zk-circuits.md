# ADR-002: Choice of Noir for ZK Circuits

## Status

Accepted

## Context

We need a zero-knowledge proof system for age verification that is:
- Developer-friendly
- Efficient
- Well-documented
- Production-ready

## Decision

We will use Noir as the primary ZK circuit language.

## Consequences

### Positive
- Rust-like syntax (familiar to developers)
- Strong type system
- Good documentation
- Active community
- Backed by Aztec

### Negative
- Newer ecosystem compared tocircom
- Fewer third-party libraries
- Requires Nargo toolchain

## Alternatives Considered

- **circom**: More mature but harder to use
- **RISC Zero**: Good but more complex setup
- **Halo2**: Powerful but steep learning curve
