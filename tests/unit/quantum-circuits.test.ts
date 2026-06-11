import { describe, it, expect } from 'vitest';
import {
  createAgeVerificationCircuit,
  createMerkleMembershipCircuit,
  createQuantumRandomCircuit,
  simulateCircuit,
  generateQuantumRandom,
  getGateCount,
  estimateFidelity,
} from '../../src/lib/quantum/circuits';

describe('Quantum Circuits', () => {
  describe('createAgeVerificationCircuit', () => {
    it('should create a circuit', () => {
      const circuit = createAgeVerificationCircuit(18);
      expect(circuit.id).toBeDefined();
      expect(circuit.qubits).toBe(3);
      expect(circuit.gates.length).toBeGreaterThan(0);
    });
  });

  describe('createMerkleMembershipCircuit', () => {
    it('should create circuit with correct qubits', () => {
      const circuit = createMerkleMembershipCircuit(3);
      expect(circuit.qubits).toBe(4);
    });
  });

  describe('createQuantumRandomCircuit', () => {
    it('should create circuit with correct bits', () => {
      const circuit = createQuantumRandomCircuit(8);
      expect(circuit.qubits).toBe(8);
    });
  });

  describe('simulateCircuit', () => {
    it('should simulate a circuit', async () => {
      const circuit = createAgeVerificationCircuit(18);
      const result = await simulateCircuit(circuit);
      expect(result.circuitId).toBe(circuit.id);
      expect(result.classicalBits.length).toBe(3);
    });
  });

  describe('generateQuantumRandom', () => {
    it('should generate random bits', async () => {
      const result = await generateQuantumRandom(8);
      expect(result.bits).toBe(8);
      expect(result.data.length).toBe(8);
    });
  });

  describe('getGateCount', () => {
    it('should count gates', () => {
      const circuit = createAgeVerificationCircuit(18);
      const counts = getGateCount(circuit);
      expect(counts.h).toBeGreaterThan(0);
    });
  });

  describe('estimateFidelity', () => {
    it('should estimate fidelity < 1', () => {
      const circuit = createAgeVerificationCircuit(18);
      const fidelity = estimateFidelity(circuit);
      expect(fidelity).toBeLessThan(1);
      expect(fidelity).toBeGreaterThan(0.9);
    });
  });
});
