import { describe, it, expect } from 'vitest';
import {
  generatePQCKeyPair,
  pqcSign,
  pqcVerify,
  pqcEncapsulate,
  pqcDecapsulate,
  hybridSign,
  hybridVerify,
  deriveQuantumKey,
  PQC_ALGORITHMS,
} from '../../src/lib/pqc/post-quantum';

describe('Post-Quantum Cryptography', () => {
  describe('generatePQCKeyPair', () => {
    it('should generate Dilithium3 key pair', async () => {
      const { publicKey, privateKey } = await generatePQCKeyPair('DILITHIUM3');
      expect(publicKey.length).toBe(PQC_ALGORITHMS.DILITHIUM3.publicKeySize);
      expect(privateKey.length).toBe(PQC_ALGORITHMS.DILITHIUM3.secretKeySize);
    });

    it('should generate Kyber768 key pair', async () => {
      const { publicKey, privateKey } = await generatePQCKeyPair('KYBER768');
      expect(publicKey.length).toBe(PQC_ALGORITHMS.KYBER768.publicKeySize);
      expect(privateKey.length).toBe(PQC_ALGORITHMS.KYBER768.secretKeySize);
    });
  });

  describe('pqcSign and pqcVerify', () => {
    it('should sign and verify', async () => {
      const { publicKey, privateKey } = await generatePQCKeyPair('DILITHIUM3');
      const message = new Uint8Array([1, 2, 3, 4, 5]);

      const signature = await pqcSign(privateKey, message, 'DILITHIUM3');
      const valid = await pqcVerify(publicKey, message, signature);

      expect(valid).toBe(true);
    });
  });

  describe('pqcEncapsulate and pqcDecapsulate', () => {
    it('should encapsulate and decapsulate', async () => {
      const { publicKey, privateKey } = await generatePQCKeyPair('KYBER768');

      const { ciphertext, sharedSecret } = await pqcEncapsulate(publicKey, 'KYBER768');
      expect(ciphertext.length).toBe(PQC_ALGORITHMS.KYBER768.ciphertextSize);
      expect(sharedSecret.length).toBe(32);

      const decapsulated = await pqcDecapsulate(privateKey, ciphertext, 'KYBER768');
      expect(decapsulated.length).toBe(32);
    });
  });

  describe('hybridSign and hybridVerify', () => {
    it('should sign and verify with hybrid scheme', async () => {
      const classicalKey = new Uint8Array(32);
      crypto.getRandomValues(classicalKey);

      const { publicKey: pqcPublic, privateKey: pqcPrivate } = await generatePQCKeyPair('DILITHIUM3');
      const message = new Uint8Array([1, 2, 3, 4, 5]);

      const hybridSig = await hybridSign(classicalKey, pqcPrivate, message);
      const classicalPublic = classicalKey;

      const valid = await hybridVerify(classicalPublic, pqcPublic, message, hybridSig);
      expect(valid).toBe(true);
    });
  });

  describe('deriveQuantumKey', () => {
    it('should derive key from quantum random', async () => {
      const key = await deriveQuantumKey('01010101', 32);
      expect(key.id).toBeDefined();
      expect(key.keySize).toBe(32);
      expect(key.algorithm).toBe('quantum-aes-256');
    });
  });
});
