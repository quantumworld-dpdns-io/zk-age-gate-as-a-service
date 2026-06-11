# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Zero-Knowledge age proof generation and verification (Noir circuits)
- RISC Zero guest program for ZK age verification
- Quantum computing integration (Qiskit circuits, CUDA-Q kernels)
- Post-quantum cryptography (CRYSTALS-Dilithium, Kyber)
- Hybrid classical + PQC signature schemes
- Cloudflare Workers API layer with Hono
- D1 database schema with migrations
- KV caching layer
- R2 object storage for proof artifacts
- Vectorize for semantic search
- React age gate widget
- Embeddable components
- MCP server for AI agent integration
- OpenTelemetry observability
- Robot Framework OWASP Top 10 security tests
- CI/CD pipelines (GitHub Actions)
- Automated releases and versioning
- Security headers middleware
- Rate limiting middleware
- Input validation with Zod
- JWT authentication
- API key management
- Admin dashboard endpoints

### Security
- OWASP Top 10 mitigations implemented
- Content Security Policy headers
- HSTS enforcement
- XSS protection
- CSRF protection
- SQL injection prevention
- Rate limiting per IP and user

## [0.1.0] - 2026-06-11

### Added
- Initial project scaffold
- Basic Cloudflare Workers setup
- Database migrations
- API route stubs
