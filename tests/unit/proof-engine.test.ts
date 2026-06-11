import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateAge, generateProof, verifyProof, listCircuits, getCircuitInfo } from '../../src/lib/zk/proof-engine';

describe('ZK Proof Engine', () => {
  describe('calculateAge', () => {
    it('should calculate correct age', () => {
      const age = calculateAge('2000-01-01', '2024-01-01');
      expect(age).toBe(24);
    });

    it('should handle birthday not yet passed', () => {
      const age = calculateAge('2000-06-15', '2024-06-10');
      expect(age).toBe(23);
    });

    it('should handle birthday already passed', () => {
      const age = calculateAge('2000-06-15', '2024-06-20');
      expect(age).toBe(24);
    });

    it('should throw for future date', () => {
      expect(() => calculateAge('2030-01-01', '2024-01-01')).toThrow('Birth date cannot be in the future');
    });
  });

  describe('listCircuits', () => {
    it('should return available circuits', () => {
      const circuits = listCircuits();
      expect(circuits.length).toBe(3);
      expect(circuits.map((c) => c.id)).toContain('age_range_v1');
    });
  });

  describe('getCircuitInfo', () => {
    it('should return circuit info', () => {
      const info = getCircuitInfo('age_range_v1');
      expect(info).toBeDefined();
      expect(info?.name).toBe('Age Range Proof');
    });

    it('should return undefined for unknown circuit', () => {
      const info = getCircuitInfo('unknown');
      expect(info).toBeUndefined();
    });
  });

  describe('generateProof', () => {
    it('should generate a proof', async () => {
      const proof = await generateProof({
        birthDate: '2000-01-01',
        minAge: 18,
      });

      expect(proof.id).toBeDefined();
      expect(proof.proof).toBeDefined();
      expect(proof.publicOutputs.ageVerified).toBe(true);
      expect(proof.circuitId).toBe('age_range_v1');
    });

    it('should reject unknown circuit', async () => {
      await expect(
        generateProof({
          birthDate: '2000-01-01',
          minAge: 18,
          circuitId: 'unknown',
        }),
      ).rejects.toThrow('Unknown circuit');
    });
  });

  describe('verifyProof', () => {
    it('should verify valid proof', async () => {
      const valid = await verifyProof('valid-proof', {
        ageVerified: true,
        minAge: 18,
        timestamp: Math.floor(Date.now() / 1000),
      });

      expect(valid).toBe(true);
    });

    it('should reject expired proof', async () => {
      const valid = await verifyProof('valid-proof', {
        ageVerified: true,
        minAge: 18,
        timestamp: Math.floor(Date.now() / 1000) - 100000,
      });

      expect(valid).toBe(false);
    });

    it('should reject empty proof', async () => {
      const valid = await verifyProof('', {
        ageVerified: true,
        minAge: 18,
        timestamp: Math.floor(Date.now() / 1000),
      });

      expect(valid).toBe(false);
    });
  });
});
