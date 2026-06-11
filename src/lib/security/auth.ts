import type { Context, Next } from 'hono';

export async function authenticate(): Promise<void> {
  return async (c: Context, next: Next): Promise<void> => {
    const authHeader = c.req.header('Authorization');
    const apiKey = c.req.header('X-API-Key');
    const sessionId = c.req.header('X-Session-ID');

    if (!authHeader && !apiKey && !sessionId) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    if (apiKey) {
      const keyHash = await hashApiKey(apiKey);
      const key = await c.env.DB.prepare('SELECT * FROM api_keys WHERE key_hash = ?')
        .bind(keyHash)
        .first();

      if (!key) {
        return c.json({ error: 'Invalid API key' }, 401);
      }

      c.set('userId', key.user_id);
      c.set('permissions', JSON.parse(key.permissions as string));
    }

    if (sessionId) {
      const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE id = ?')
        .bind(sessionId)
        .first();

      if (!session) {
        return c.json({ error: 'Invalid session' }, 401);
      }

      const expiresAt = new Date(session.expires_at as string);
      if (expiresAt < new Date()) {
        return c.json({ error: 'Session expired' }, 401);
      }
    }

    await next();
  };
}

export async function requireAdmin(): Promise<void> {
  return async (c: Context, next: Next): Promise<void> => {
    const permissions = c.get('permissions') as string[] | undefined;

    if (!permissions || !permissions.includes('admin')) {
      return c.json({ error: 'Admin access required' }, 403);
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
