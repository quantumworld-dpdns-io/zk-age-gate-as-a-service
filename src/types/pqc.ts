export interface PQCAlgorithm {
  name: string;
  type: 'kem' | 'signature';
  securityLevel: 1 | 2 | 3 | 5;
  publicKeySize: number;
  secretKeySize: number;
  ciphertextSize?: number;
  signatureSize?: number;
}

export interface PQCKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
  algorithm: PQCAlgorithm;
}

export interface PQCSignature {
  algorithm: string;
  signature: Uint8Array;
  signedAt: string;
}

export interface PQCEncapsulation {
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}
