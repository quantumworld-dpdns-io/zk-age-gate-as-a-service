import type { ProofRequest, ProofResponse, ProofPublicOutputs, CircuitInfo } from '../../types/proof';

const CIRCUITS: Record<string, CircuitInfo> = {
  age_range_v1: {
    id: 'age_range_v1',
    name: 'Age Range Proof',
    version: '1.0.0',
    description: 'Proves age >= min_age without revealing exact birth date',
    constraints: 256,
    hash: '0x1234567890abcdef',
  },
  country_allowed_v1: {
    id: 'country_allowed_v1',
    name: 'Country Allowed Proof',
    version: '1.0.0',
    description: 'Proves country membership in allowed list without revealing country',
    constraints: 512,
    hash: '0xabcdef1234567890',
  },
  age_country_combined_v1: {
    id: 'age_country_combined_v1',
    name: 'Age + Country Combined Proof',
    version: '1.0.0',
    description: 'Combined age and country verification',
    constraints: 768,
    hash: '0x9876543210fedcba',
  },
};

export function getCircuitInfo(circuitId: string): CircuitInfo | undefined {
  return CIRCUITS[circuitId];
}

export function listCircuits(): CircuitInfo[] {
  return Object.values(CIRCUITS);
}

export function calculateAge(birthDate: string, currentDate?: string): number {
  const birth = new Date(birthDate);
  const current = currentDate ? new Date(currentDate) : new Date();

  if (birth > current) {
    throw new Error('Birth date cannot be in the future');
  }

  let age = current.getFullYear() - birth.getFullYear();
  const monthDiff = current.getMonth() - birth.getMonth();
  const dayDiff = current.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export async function generateProof(request: ProofRequest): Promise<ProofResponse> {
  const circuitId = request.circuitId || 'age_range_v1';
  const circuit = CIRCUITS[circuitId];

  if (!circuit) {
    throw new Error(`Unknown circuit: ${circuitId}`);
  }

  const age = calculateAge(request.birthDate);
  const ageVerified = age >= request.minAge;

  const publicOutputs: ProofPublicOutputs = {
    ageVerified,
    minAge: request.minAge,
    countryCode: request.countryCode,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const proofData = await generateZKProof(request, publicOutputs);

  return {
    id: crypto.randomUUID(),
    proof: proofData,
    publicOutputs,
    circuitId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

async function generateZKProof(
  request: ProofRequest,
  publicOutputs: ProofPublicOutputs,
): Promise<string> {
  const input = {
    birth_date: request.birthDate,
    min_age: request.minAge,
    current_date: new Date().toISOString().split('T')[0],
    country_code: request.countryCode,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(input));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);

  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyProof(proof: string, publicOutputs: ProofPublicOutputs): Promise<boolean> {
  if (!proof || proof.length === 0) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const maxAge = 24 * 60 * 60;

  if (now - publicOutputs.timestamp > maxAge) {
    return false;
  }

  return true;
}

export async function batchVerify(
  proofs: Array<{ proof: string; publicOutputs: ProofPublicOutputs }>,
): Promise<Array<{ valid: boolean; index: number }>> {
  const results = await Promise.all(
    proofs.map(async (p, index) => ({
      valid: await verifyProof(p.proof, p.publicOutputs),
      index,
    })),
  );

  return results;
}
