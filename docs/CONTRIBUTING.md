# Contributing to ZK Age Gate

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js >= 20
- npm >= 10
- Wrangler CLI (installed via npm)
- Robot Framework (Python) for security tests

### Getting Started

```bash
# Clone the repository
git clone https://github.com/quantumworld-dpdns-io/zk-age-gate-as-a-service.git
cd zk-age-gate-as-a-service

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Development Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Run linting: `npm run lint`
4. Run formatting: `npm run format`
5. Run type checking: `npm run typecheck`
6. Run tests: `npm test`
7. Commit with conventional commits
8. Push and create a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `perf:` performance improvements
- `test:` adding tests
- `build:` build system changes
- `ci:` CI/CD changes
- `chore:` maintenance tasks

### Code Style

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- No `any` types
- No floating promises
- Use Web Crypto API for cryptography

### Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Security tests (Robot Framework)
npm run test:robot

# All tests
npm test
```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review feedback
6. Merge after approval

## Architecture

See [docs/architecture/](docs/architecture/) for architecture documentation.

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
