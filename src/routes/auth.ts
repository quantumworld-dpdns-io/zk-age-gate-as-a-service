import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../index';

const authRoutes = new Hono<{ Bindings: Bindings }>();

const createSessionSchema = z.object({
  apiKey: z.string().min(1),
});

authRoutes.post(
  '/session',
  zValidator('json', createSessionSchema),
  async (c) => {
    const data = c.req.valid('json');
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

    await c.env.DB.prepare(
      'INSERT INTO sessions (id, api_key_hash, created_at, expires_at) VALUES (?, ?, ?, ?)',
    )
      .bind(sessionId, await hashApiKey(data.apiKey), now.toISOString(), expiresAt.toISOString())
      .run();

    return c.json({
      sessionId,
      expiresAt: expiresAt.toISOString(),
    }, 201);
  },
);

authRoutes.delete('/session', async (c) => {
  const sessionId = c.req.header('X-Session-ID');

  if (!sessionId) {
    return c.json({ error: 'Session ID required' }, 400);
  }

  await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();

  return c.json({ message: 'Session destroyed' });
});

authRoutes.post('/refresh', async (c) => {
  const sessionId = c.req.header('X-Session-ID');

  if (!sessionId) {
    return c.json({ error: 'Session ID required' }, 400);
  }

  const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first();

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

  await c.env.DB.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?')
    .bind(expiresAt.toISOString(), sessionId)
    .run();

  return c.json({
    sessionId,
    expiresAt: expiresAt.toISOString(),
  });
});

async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export { authRoutes };
