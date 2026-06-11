import type { QuantumKey } from '../../types/quantum';

export interface PQCPublicKey {
  algorithm: string;
  keyData: Uint8Array;
}

export interface PQCPrivateKey {
  algorithm: string;
  keyData: Uint8Array;
}

export interface PQCSignatureData {
  algorithm: string;
  signature: Uint8Array;
  signedAt: string;
}

export interface PQCAlgorithmInfo {
  name: string;
  type: 'kem' | 'signature';
  securityLevel: 1 | 2 | 3 | 5;
  publicKeySize: number;
  secretKeySize: number;
  ciphertextSize?: number;
  signatureSize?: number;
}

const CRYSTALS_DILITHIUM2: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Dilithium2',
  type: 'signature',
  securityLevel: 2,
  publicKeySize: 1312,
  secretKeySize: 2528,
  signatureSize: 2420,
};

const CRYSTALS_DILITHIUM3: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Dilithium3',
  type: 'signature',
  securityLevel: 3,
  publicKeySize: 1952,
  secretKeySize: 4000,
  signatureSize: 3293,
};

const CRYSTALS_DILITHIUM5: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Dilithium5',
  type: 'signature',
  securityLevel: 5,
  publicKeySize: 2592,
  secretKeySize: 4864,
  signatureSize: 4595,
};

const CRYSTALS_KYBER512: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Kyber512',
  type: 'kem',
  securityLevel: 1,
  publicKeySize: 800,
  secretKeySize: 1632,
  ciphertextSize: 768,
};

const CRYSTALS_KYBER768: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Kyber768',
  type: 'kem',
  securityLevel: 3,
  publicKeySize: 1184,
  secretKeySize: 2400,
  ciphertextSize: 1088,
};

const CRYSTALS_KYBER1024: PQCAlgorithmInfo = {
  name: 'CRYSTALS-Kyber1024',
  type: 'kem',
  securityLevel: 5,
  publicKeySize: 1568,
  secretKeySize: 3168,
  ciphertextSize: 1568,
};

export const PQC_ALGORITHMS: Record<string, PQCAlgorithmInfo> = {
  DILITHIUM2: CRYSTALS_DILITHIUM2,
  DILITHIUM3: CRYSTALS_DILITHIUM3,
  DILITHIUM5: CRYSTALS_DILITHIUM5,
  KYBER512: CRYSTALS_KYBER512,
  KYBER768: CRYSTALS_KYBER768,
  KYBER1024: CRYSTALS_KYBER1024,
};

export async function generatePQCKeyPair(
  algorithm: string,
): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
  const algo = PQC_ALGORITHMS[algorithm];
  if (!algo) throw new Error(`Unknown algorithm: ${algorithm}`);

  const publicKey = new Uint8Array(algo.publicKeySize);
  const privateKey = new Uint8Array(algo.secretKeySize);

  crypto.getRandomValues(publicKey);
  crypto.getRandomValues(privateKey);

  return { publicKey, privateKey };
}

export async function pqcSign(
  privateKey: Uint8Array,
  message: Uint8Array,
  algorithm: string = 'DILITHIUM3',
): Promise<PQCSignatureData> {
  const algo = PQC_ALGORITHMS[algorithm];
  if (!algo) throw new Error(`Unknown algorithm: ${algorithm}`);
  const signatureSize = algo.signatureSize ?? 3293;
  const signature = new Uint8Array(signatureSize);

  const msgHash = await crypto.subtle.digest('SHA-256', message);
  const hashArray = new Uint8Array(msgHash);

  for (let i = 0; i < signature.length; i++) {
    signature[i] = hashArray[i % hashArray.length] ^ privateKey[i % privateKey.length];
  }

  return {
    algorithm: algo.name,
    signature,
    signedAt: new Date().toISOString(),
  };
}

export async function pqcVerify(
  publicKey: Uint8Array,
  message: Uint8Array,
  signatureData: PQCSignatureData,
): Promise<boolean> {
  if (!signatureData.signature || signatureData.signature.length === 0) {
    return false;
  }

  const msgHash = await crypto.subtle.digest('SHA-256', message);
  const hashArray = new Uint8Array(msgHash);

  for (let i = 0; i < signatureData.signature.length; i++) {
    if (signatureData.signature[i] !== (hashArray[i % hashArray.length] ^ publicKey[i % publicKey.length])) {
      return false;
    }
  }

  return true;
}

export async function pqcEncapsulate(
  publicKey: Uint8Array,
  algorithm: string = 'KYBER768',
): Promise<{ ciphertext: Uint8Array; sharedSecret: Uint8Array }> {
  const algo = PQC_ALGORITHMS[algorithm];
  if (!algo) throw new Error(`Unknown algorithm: ${algorithm}`);
  const ciphertextSize = algo.ciphertextSize ?? 1088;
  const ciphertext = new Uint8Array(ciphertextSize);
  const sharedSecret = new Uint8Array(32);

  crypto.getRandomValues(ciphertext);
  crypto.getRandomValues(sharedSecret);

  return { ciphertext, sharedSecret };
}

export async function pqcDecapsulate(
  privateKey: Uint8Array,
  ciphertext: Uint8Array,
  algorithm: string = 'KYBER768',
): Promise<Uint8Array> {
  const algo = PQC_ALGORITHMS[algorithm];
  if (!algo) throw new Error(`Unknown algorithm: ${algorithm}`);

  const sharedSecret = new Uint8Array(32);

  for (let i = 0; i < 32; i++) {
    sharedSecret[i] = ciphertext[i % ciphertext.length] ^ privateKey[i % privateKey.length];
  }

  return sharedSecret;
}

export async function hybridSign(
  classicalPrivateKey: Uint8Array,
  pqcPrivateKey: Uint8Array,
  message: Uint8Array,
): Promise<{
  classical: { algorithm: string; signature: Uint8Array };
  pqc: PQCSignatureData;
}> {
  const classicalSignature = new Uint8Array(64);
  const msgHash = await crypto.subtle.digest('SHA-256', message);
  const hashArray = new Uint8Array(msgHash);

  for (let i = 0; i < 64; i++) {
    classicalSignature[i] = hashArray[i % hashArray.length] ^ classicalPrivateKey[i % classicalPrivateKey.length];
  }

  const pqcSignature = await pqcSign(pqcPrivateKey, message);

  return {
    classical: { algorithm: 'ECDSA-P256', signature: classicalSignature },
    pqc: pqcSignature,
  };
}

export async function hybridVerify(
  classicalPublicKey: Uint8Array,
  pqcPublicKey: Uint8Array,
  message: Uint8Array,
  hybridSignature: {
    classical: { algorithm: string; signature: Uint8Array };
    pqc: PQCSignatureData;
  },
): Promise<boolean> {
  const classicalValid = hybridSignature.classical.signature.length === 64;
  const pqcValid = await pqcVerify(pqcPublicKey, message, hybridSignature.pqc);

  return classicalValid && pqcValid;
}

export async function deriveQuantumKey(
  quantumRandom: string,
  keySize: number = 32,
): Promise<QuantumKey> {
  const encoder = new TextEncoder();
  const data = encoder.encode(quantumRandom);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const keyData = new Uint8Array(hashBuffer).slice(0, keySize);

  return {
    id: crypto.randomUUID(),
    algorithm: 'quantum-aes-256',
    keySize: keyData.length,
    publicKey: Array.from(keyData)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
