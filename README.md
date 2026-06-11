# ZK Age Gate as a Service

> Zero-Knowledge Age Verification via Verifiable Credentials & ZKP — quantum-resistant, privacy-preserving, production-ready.

[![CI](https://github.com/quantumworld-dpdns-io/zk-age-gate-as-a-service/actions/workflows/ci.yml/badge.svg)](https://github.com/quantumworld-dpdns-io/zk-age-gate-as-a-service/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org)

## Overview

ZK Age Gate as a Service lets users prove they are 18+ (or any age threshold) using **Zero-Knowledge Proofs** and **Verifiable Credentials** — without exposing their full identity data.

This service is **quantum-resistant** (post-quantum cryptography) and optionally leverages **quantum computing** for enhanced security primitives.

Part of the [quantumworld-dpdns-io](https://github.com/quantumworld-dpdns-io) Wild SaaS & Tech Development initiative.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React Widget │ Demo Page │ Mobile SDK │ Embeddable iFrame       │
├─────────────────────────────────────────────────────────────────┤
│                     API GATEWAY (Cloudflare Workers)             │
│  Rate Limiting │ Auth │ Input Validation │ CORS │ CSP            │
├──────────┬──────────┬──────────┬──────────┬─────────────────────┤
│ ZK PROOF │ QUANTUM  │ POST-QT  │ STORAGE  │ OBSERVABILITY       │
│ ENGINE   │ COMPUTE  │ CRYPTO   │ LAYER    │                     │
│ Noir     │ Qiskit   │ Dilithium│ D1/KV/R2 │ OpenTelemetry       │
│ RISC Zero│ CUDA-Q   │ Kyber    │ Vectorize│ Analytics Engine    │
├──────────┴──────────┴──────────┴──────────┴─────────────────────┤
│                    SECURITY LAYER                                │
│  OWASP Top 10 │ Turnstile │ WAF │ Bot Mgmt │ API Shield         │
├─────────────────────────────────────────────────────────────────┤
│                    ECOSYSTEM INTEGRATIONS                        │
│  MCP Server │ Redis │ WebAssembly │ Federated ML │ Qiskit        │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Cloudflare Workers | Edge compute |
| HTTP Framework | Hono | Request routing |
| ZK Proofs | Noir + RISC Zero | Zero-knowledge age verification |
| Quantum | Qiskit + CUDA-Q | Quantum-enhanced cryptography |
| Post-Quantum | CRYSTALS-Dilithium + Kyber | Quantum-resistant signatures |
| SQL Storage | D1 (SQLite) | Persistent relational data |
| Cache | KV + Redis (DragonflyDB) | Session & proof caching |
| Object Storage | R2 | Proof artifacts |
| Vector DB | Vectorize | Semantic search |
| AI/ML | Workers AI | Embeddings & inference |
| Frontend | React + TypeScript | Age gate widget |
| Testing | Vitest + Robot Framework | Unit, integration, OWASP security |
| Security | Turnstile + WAF + CSP | Bot protection & hardening |
| CI/CD | GitHub Actions | Build, test, release, deploy |
| Observability | OpenTelemetry | Tracing & metrics |
| MCP | Model Context Protocol | AI agent integration |
| WASM | WebAssembly | PQC algorithm execution |

## Quick Start

```bash
# Clone
git clone https://github.com/quantumworld-dpdns-io/zk-age-gate-as-a-service.git
cd zk-age-gate-as-a-service

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test
npm run test:robot
```

## Project Structure

```
.
├── src/
│   ├── index.ts              # Worker entry point
│   ├── routes/               # API route handlers
│   ├── middleware/            # Hono middleware
│   ├── lib/
│   │   ├── zk/               # ZK proof engine (Noir, RISC Zero)
│   │   ├── quantum/          # Quantum computing (Qiskit, CUDA-Q)
│   │   ├── pqc/              # Post-quantum crypto (Dilithium, Kyber)
│   │   ├── storage/          # D1, KV, R2, Vectorize
│   │   ├── security/         # OWASP Top 10, validation, rate limiting
│   │   ├── observability/    # OpenTelemetry, metrics, logging
│   │   ├── cache/            # Redis/DragonflyDB
│   │   ├── mcp/              # Model Context Protocol server
│   │   ├── analytics/        # Analytics Engine
│   │   └── wasm/             # WebAssembly modules
│   └── types/                # TypeScript type definitions
├── circuits/
│   ├── age_range/            # Noir age range circuit
│   ├── country_allowed/      # Noir country restriction circuit
│   └── age_country_combined/ # Combined circuit
├── frontend/                 # React age gate widget & demo
├── sdk/                      # Mobile SDK, embeddable components
├── tests/
│   ├── unit/                 # Vitest unit tests
│   ├── integration/          # Vitest integration tests
│   ├── security/             # Security-specific tests
│   ├── robot/                # Robot Framework OWASP tests
│   └── e2e/                  # End-to-end tests
├── migrations/               # D1 database migrations
├── docs/
│   ├── architecture/         # Architecture docs & ADRs
│   ├── api/                  # OpenAPI specs & API guides
│   ├── guides/               # Developer guides
│   ├── runbooks/             # Operational runbooks
│   └── MASTER-PLAN.md        # 1200-todo master plan
└── .github/
    └── workflows/            # CI/CD pipelines
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/v1/proofs/generate` | Generate ZK age proof |
| `POST` | `/api/v1/proofs/verify` | Verify ZK age proof |
| `GET` | `/api/v1/proofs/:id` | Get proof by ID |
| `DELETE` | `/api/v1/proofs/:id` | Revoke proof |
| `POST` | `/api/v1/credentials/issue` | Issue verifiable credential |
| `POST` | `/api/v1/credentials/verify` | Verify credential |
| `POST` | `/api/v1/auth/session` | Create session |
| `GET` | `/api/v1/admin/stats` | System statistics |

## Security

- **OWASP Top 10** fully addressed with Robot Framework test suite
- **Post-quantum cryptography** (CRYSTALS-Dilithium, Kyber) for quantum resistance
- **Cloudflare Turnstile** for bot protection
- **WAF rules** and **rate limiting** at the edge
- **Content Security Policy** and security headers enforced

## Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Security tests (Robot Framework + OWASP)
npm run test:robot

# All tests
npm test
```

## Development

```bash
# Local dev server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Formatting
npm run format
```

## Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before opening a pull request.

## Master Plan

See [docs/MASTER-PLAN.md](docs/MASTER-PLAN.md) for the full 1200-todo development plan across 12 phases.

## License

[MIT](LICENSE)
