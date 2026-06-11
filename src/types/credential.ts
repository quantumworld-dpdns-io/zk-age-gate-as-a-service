export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof?: CredentialProof;
}

export interface CredentialSubject {
  id: string;
  ageVerified: boolean;
  minAge: number;
  countryCode?: string;
}

export interface CredentialProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface CredentialStatus {
  id: string;
  type: string;
  statusListIndex: string;
  statusListCredential: string;
}

export interface CredentialSchema {
  id: string;
  type: string;
}
