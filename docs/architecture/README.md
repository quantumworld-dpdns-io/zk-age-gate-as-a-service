# Architecture Overview

## System Architecture

The ZK Age Gate as a Service is built on Cloudflare Workers with the following layers:

### Client Layer
- React Age Gate Widget
- Demo Application
- Mobile SDK
- Embeddable iFrame

### API Gateway (Cloudflare Workers)
- Hono HTTP framework
- Rate limiting middleware
- Authentication middleware
- Input validation
- CORS and CSP headers

### ZK Proof Engine
- Noir circuits for age verification
- RISC Zero guest programs
- Proof generation and verification
- Circuit versioning

### Quantum Computing
- Qiskit circuits
- CUDA-Q kernels
- Quantum random number generation
- Quantum key distribution

### Post-Quantum Cryptography
- CRYSTALS-Dilithium signatures
- CRYSTALS-Kyber key encapsulation
- Hybrid classical + PQC schemes
- liboqs WASM bindings

### Storage Layer
- D1 (SQLite) for relational data
- KV for caching
- R2 for object storage
- Vectorize for embeddings

### Security
- OWASP Top 10 mitigations
- Turnstile bot protection
- WAF rules
- Security headers

### Observability
- OpenTelemetry tracing
- Structured logging
- Metrics collection
- Analytics Engine

## Data Flow

1. Client sends age verification request
2. API Gateway validates input
3. ZK Proof Engine generates proof
4. Proof stored in D1 + R2
5. Verification response returned
6. Audit log created

## Security Model

- Zero-knowledge: Age verified without revealing birth date
- Quantum-resistant: PQC algorithms protect against quantum attacks
- Defense in depth: Multiple security layers
- Least privilege: Minimal data exposure
