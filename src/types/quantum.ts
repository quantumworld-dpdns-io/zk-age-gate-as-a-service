export interface QuantumCircuit {
  id: string;
  name: string;
  qubits: number;
  depth: number;
  gates: QuantumGate[];
}

export interface QuantumGate {
  name: string;
  qubits: number[];
  params?: number[];
}

export interface QuantumProof {
  circuitId: string;
  state: string;
  measurement: string;
  classicalBits: number[];
}

export interface QuantumKey {
  id: string;
  algorithm: string;
  keySize: number;
  publicKey: string;
  createdAt: string;
  expiresAt: string;
}

export interface QuantumRandomResult {
  bits: number;
  entropy: number;
  data: string;
}
