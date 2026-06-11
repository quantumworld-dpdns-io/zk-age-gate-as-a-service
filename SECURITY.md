# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within zk-age-gate, please send an email to the project maintainers. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions.
2. Audit code to find any potential similar problems.
3. Prepare fixes for all releases still under maintenance.
4. Release the new version.

## Security Measures

### Cryptographic Security

- **Zero-Knowledge Proofs**: Age verification without revealing personal data
- **Post-Quantum Cryptography**: CRYSTALS-Dilithium and Kyber for quantum resistance
- **Hybrid Schemes**: Classical + PQC for defense in depth
- **Web Crypto API**: All cryptographic operations use secure randomness

### Application Security

- **OWASP Top 10**: Full coverage with automated testing
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Per-IP and per-user rate limiting
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Authentication**: JWT + API key authentication
- **Session Management**: Secure session handling with expiration

### Infrastructure Security

- **Cloudflare WAF**: Web Application Firewall protection
- **Cloudflare Turnstile**: Bot detection and CAPTCHA
- **DDoS Protection**: Built-in Cloudflare DDoS mitigation
- **TLS 1.3**: Enforced HTTPS for all connections

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Security Updates

Security updates will be released as patch versions. Please ensure you are always running the latest version.
