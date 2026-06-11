# ADR-005: Hybrid Post-Quantum Cryptography

## Status

Accepted

## Context

We need to protect against quantum computing threats while maintaining backward compatibility.

## Decision

We will implement hybrid classical + PQC schemes:
- ECDSA + CRYSTALS-Dilithium for signatures
- ECDH + CRYSTALS-Kyber for key exchange

## Consequences

### Positive
- Defense in depth
- Backward compatible
- Quantum-resistant
- NIST standardized algorithms

### Negative
- Larger key and signature sizes
- More computational overhead
- Complex implementation

## Alternatives Considered

- **Pure PQC**: Not backward compatible
- **Classical only**: Vulnerable to quantum attacks
- **Multiple PQC algorithms**: More complexity
