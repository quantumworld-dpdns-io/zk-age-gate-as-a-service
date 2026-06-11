import type {
  QuantumCircuit,
  QuantumGate,
  QuantumProof,
  QuantumRandomResult,
} from '../../types/quantum';

export function createAgeVerificationCircuit(minAge: number): QuantumCircuit {
  const gates: QuantumGate[] = [
    { name: 'h', qubits: [0] },
    { name: 'cx', qubits: [0, 1] },
    { name: 'rz', qubits: [0], params: [minAge * 0.1] },
    { name: 'h', qubits: [1] },
    { name: 'cx', qubits: [1, 2] },
    { name: 'measure', qubits: [0, 1, 2] },
  ];

  return {
    id: crypto.randomUUID(),
    name: 'age_verification',
    qubits: 3,
    depth: gates.length,
    gates,
  };
}

export function createMerkleMembershipCircuit(treeDepth: number): QuantumCircuit {
  const gates: QuantumGate[] = [];

  for (let i = 0; i < treeDepth; i++) {
    gates.push({ name: 'h', qubits: [i] });
    gates.push({ name: 'cx', qubits: [i, i + 1] });
  }

  gates.push({ name: 'measure', qubits: Array.from({ length: treeDepth + 1 }, (_, i) => i) });

  return {
    id: crypto.randomUUID(),
    name: 'merkle_membership',
    qubits: treeDepth + 1,
    depth: gates.length,
    gates,
  };
}

export function createQuantumRandomCircuit(bits: number): QuantumCircuit {
  const gates: QuantumGate[] = [];

  for (let i = 0; i < bits; i++) {
    gates.push({ name: 'h', qubits: [i] });
  }

  gates.push({ name: 'measure', qubits: Array.from({ length: bits }, (_, i) => i) });

  return {
    id: crypto.randomUUID(),
    name: 'quantum_random',
    qubits: bits,
    depth: gates.length,
    gates,
  };
}

export function createKeyDistributionCircuit(keySize: number): QuantumCircuit {
  const gates: QuantumGate[] = [];

  for (let i = 0; i < keySize; i++) {
    gates.push({ name: 'h', qubits: [i] });
    gates.push({ name: 'x', qubits: [i] });
  }

  gates.push({ name: 'measure', qubits: Array.from({ length: keySize }, (_, i) => i) });

  return {
    id: crypto.randomUUID(),
    name: 'key_distribution',
    qubits: keySize,
    depth: gates.length,
    gates,
  };
}

export async function simulateCircuit(circuit: QuantumCircuit): Promise<QuantumProof> {
  const classicalBits: number[] = [];

  for (let i = 0; i < circuit.qubits; i++) {
    classicalBits.push(Math.random() > 0.5 ? 1 : 0);
  }

  return {
    circuitId: circuit.id,
    state: Buffer.from(JSON.stringify({ qubits: circuit.qubits, result: classicalBits })).toString(
      'base64',
    ),
    measurement: classicalBits.join(''),
    classicalBits,
  };
}

export async function generateQuantumRandom(bits: number): Promise<QuantumRandomResult> {
  const circuit = createQuantumRandomCircuit(bits);
  const result = await simulateCircuit(circuit);

  return {
    bits,
    entropy: bits * Math.log2(2),
    data: result.measurement,
  };
}

export function getGateCount(circuit: QuantumCircuit): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const gate of circuit.gates) {
    counts[gate.name] = (counts[gate.name] || 0) + 1;
  }
  return counts;
}

export function estimateFidelity(circuit: QuantumCircuit): number {
  const gateErrors: Record<string, number> = {
    h: 0.999,
    cx: 0.99,
    rz: 0.995,
    x: 0.998,
    measure: 0.999,
  };

  let fidelity = 1;
  for (const gate of circuit.gates) {
    fidelity *= gateErrors[gate.name] || 0.99;
  }

  return fidelity;
}
