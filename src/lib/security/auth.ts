import { Context, Next } from 'hono';

export function authenticate() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const apiKey = c.req.header('X-API-Key');
    const sessionId = c.req.header('X-Session-ID');

    if (!authHeader && !apiKey && !sessionId) {
      c.json({ error: 'Authentication required' }, 401);
      return;
    }

    if (apiKey) {
      const keyHash = await hashApiKey(apiKey);
      const key = await c.env.DB.prepare('SELECT * FROM api_keys WHERE key_hash = ?')
        .bind(keyHash)
        .first();

      if (!key) {
        c.json({ error: 'Invalid API key' }, 401);
        return;
      }

      c.set('userId', key.user_id);
      c.set('permissions', JSON.parse(key.permissions as string));
    }

    if (sessionId) {
      const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE id = ?')
        .bind(sessionId)
        .first();

      if (!session) {
        c.json({ error: 'Invalid session' }, 401);
        return;
      }

      const expiresAt = new Date(session.expires_at as string);
      if (expiresAt < new Date()) {
        c.json({ error: 'Session expired' }, 401);
        return;
      }
    }

    await next();
  };
}

export function requireAdmin() {
  return async (c: Context, next: Next) => {
    const permissions = c.get('permissions') as string[] | undefined;

    if (!permissions || !permissions.includes('admin')) {
      c.json({ error: 'Admin access required' }, 403);
      return;
    }

    await next();
  };
}

async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
