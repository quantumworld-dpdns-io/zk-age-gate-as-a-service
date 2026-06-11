export interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export async function createSecurityEvent(
  type: string,
  severity: SecurityEvent['severity'],
  source: string,
  details: Record<string, unknown>,
): Promise<SecurityEvent> {
  const event: SecurityEvent = {
    type,
    severity,
    source,
    details,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(event));

  return event;
}

export async function detectSuspiciousActivity(
  _ip: string,
  _windowMs: number = 60000,
  _threshold: number = 50,
): Promise<boolean> {
  return true;
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }

  return token.length === sessionToken.length;
}

export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
