export interface ProofRequest {
  birthDate: string;
  minAge: number;
  countryCode?: string;
  circuitId?: string;
}

export interface ProofResponse {
  id: string;
  proof: string;
  publicOutputs: ProofPublicOutputs;
  circuitId: string;
  createdAt: string;
  expiresAt: string;
}

export interface ProofPublicOutputs {
  ageVerified: boolean;
  minAge: number;
  countryCode?: string;
  timestamp: number;
}

export interface ProofVerificationResult {
  valid: boolean;
  proofId: string;
  verifiedAt: string;
  publicOutputs: ProofPublicOutputs;
}

export interface ProofRecord {
  id: string;
  userId: string;
  circuitId: string;
  proof: string;
  publicOutputs: string;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface CircuitInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  constraints: number;
  hash: string;
}
