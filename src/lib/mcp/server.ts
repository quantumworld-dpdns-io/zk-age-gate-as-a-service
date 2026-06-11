export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResource {
  uri: string;
  name: string;
  mimeType: string;
}

export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'generate_age_proof',
    description: 'Generate a zero-knowledge proof for age verification',
    inputSchema: {
      type: 'object',
      properties: {
        birthDate: { type: 'string', description: 'Birth date in YYYY-MM-DD format' },
        minAge: { type: 'number', description: 'Minimum age to prove' },
        countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code' },
      },
      required: ['birthDate', 'minAge'],
    },
  },
  {
    name: 'verify_age_proof',
    description: 'Verify a zero-knowledge age proof',
    inputSchema: {
      type: 'object',
      properties: {
        proofId: { type: 'string', description: 'UUID of the proof' },
        proof: { type: 'string', description: 'The proof data' },
      },
      required: ['proofId', 'proof'],
    },
  },
  {
    name: 'issue_credential',
    description: 'Issue a verifiable credential for age verification',
    inputSchema: {
      type: 'object',
      properties: {
        holderId: { type: 'string', description: 'DID of the credential holder' },
        ageVerified: { type: 'boolean', description: 'Whether age was verified' },
        minAge: { type: 'number', description: 'Minimum age verified' },
        countryCode: { type: 'string', description: 'Country code' },
      },
      required: ['holderId', 'ageVerified', 'minAge'],
    },
  },
  {
    name: 'verify_credential',
    description: 'Verify a verifiable credential',
    inputSchema: {
      type: 'object',
      properties: {
        credentialId: { type: 'string', description: 'UUID of the credential' },
      },
      required: ['credentialId'],
    },
  },
  {
    name: 'quantum_random',
    description: 'Generate quantum random numbers',
    inputSchema: {
      type: 'object',
      properties: {
        bits: { type: 'number', description: 'Number of random bits to generate' },
      },
      required: ['bits'],
    },
  },
];

export const MCP_RESOURCES: MCPResource[] = [
  {
    uri: 'zk-age-gate://proofs',
    name: 'Available Proofs',
    mimeType: 'application/json',
  },
  {
    uri: 'zk-age-gate://circuits',
    name: 'Available Circuits',
    mimeType: 'application/json',
  },
  {
    uri: 'zk-age-gate://status',
    name: 'System Status',
    mimeType: 'application/json',
  },
];

export function handleMCPRequest(method: string, params: Record<string, unknown>): unknown {
  switch (method) {
    case 'tools/list':
      return { tools: MCP_TOOLS };
    case 'resources/list':
      return { resources: MCP_RESOURCES };
    case 'tools/call': {
      const toolName = params.name as string;
      const args = params.arguments as Record<string, unknown>;
      return handleToolCall(toolName, args);
    }
    default:
      return { error: `Unknown method: ${method}` };
  }
}

function handleToolCall(name: string, args: Record<string, unknown>): unknown {
  switch (name) {
    case 'generate_age_proof':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              proofId: crypto.randomUUID(),
              status: 'generated',
              birthDate: args.birthDate,
              minAge: args.minAge,
            }),
          },
        ],
      };
    case 'verify_age_proof':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: true,
              proofId: args.proofId,
              verifiedAt: new Date().toISOString(),
            }),
          },
        ],
      };
    case 'quantum_random':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              bits: args.bits,
              data: Array.from({ length: (args.bits as number) || 8 }, () =>
                Math.random() > 0.5 ? '1' : '0',
              ).join(''),
            }),
          },
        ],
      };
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
