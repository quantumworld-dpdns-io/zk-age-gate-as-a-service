import { describe, it, expect } from 'vitest';
import { validateCSRFToken, generateNonce } from '../../src/lib/security/monitoring';

describe('Security Monitoring', () => {
  describe('generateNonce', () => {
    it('should generate a nonce', () => {
      const nonce = generateNonce();
      expect(nonce.length).toBe(32);
      expect(/^[0-9a-f]+$/.test(nonce)).toBe(true);
    });

    it('should generate unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate matching tokens', () => {
      const token = 'abc123';
      const sessionToken = 'abc123';
      expect(validateCSRFToken(token, sessionToken)).toBe(true);
    });

    it('should reject non-matching tokens', () => {
      const token = 'abc123';
      const sessionToken = 'def456';
      expect(validateCSRFToken(token, sessionToken)).toBe(false);
    });

    it('should reject empty tokens', () => {
      expect(validateCSRFToken('', 'token')).toBe(false);
      expect(validateCSRFToken('token', '')).toBe(false);
    });
  });
});
