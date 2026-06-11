import { Hono } from 'hono';
import type { Bindings } from '../index';

const adminRoutes = new Hono<{ Bindings: Bindings }>();

adminRoutes.get('/stats', async (c) => {
  const proofs = await c.env.DB.prepare(
    'SELECT status, COUNT(*) as count FROM proofs GROUP BY status',
  ).all();

  const credentials = await c.env.DB.prepare(
    'SELECT status, COUNT(*) as count FROM credentials GROUP BY status',
  ).all();

  return c.json({
    proofs: proofs.results,
    credentials: credentials.results,
    timestamp: new Date().toISOString(),
  });
});

adminRoutes.get('/proofs', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const offset = (page - 1) * limit;

  const proofs = await c.env.DB.prepare(
    'SELECT * FROM proofs ORDER BY created_at DESC LIMIT ? OFFSET ?',
  )
    .bind(limit, offset)
    .all();

  const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM proofs').first();

  return c.json({
    proofs: proofs.results,
    pagination: {
      page,
      limit,
      total: (total as { count: number })?.count || 0,
    },
  });
});

adminRoutes.get('/credentials', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const offset = (page - 1) * limit;

  const credentials = await c.env.DB.prepare(
    'SELECT * FROM credentials ORDER BY created_at DESC LIMIT ? OFFSET ?',
  )
    .bind(limit, offset)
    .all();

  const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM credentials').first();

  return c.json({
    credentials: credentials.results,
    pagination: {
      page,
      limit,
      total: (total as { count: number })?.count || 0,
    },
  });
});

adminRoutes.get('/health', async (c) => {
  const checks: Record<string, string> = {};

  try {
    await c.env.DB.prepare('SELECT 1').first();
    checks.database = 'healthy';
  } catch {
    checks.database = 'unhealthy';
  }

  try {
    await c.env.CACHE.get('health-check');
    checks.cache = 'healthy';
  } catch {
    checks.cache = 'unhealthy';
  }

  return c.json({
    status: Object.values(checks).every((s) => s === 'healthy') ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

adminRoutes.post('/cache/purge', async (c) => {
  const keys = await c.env.CACHE.list({ limit: 100 });

  for (const key of keys.keys) {
    await c.env.CACHE.delete(key.name);
  }

  return c.json({
    message: 'Cache purged',
    keysDeleted: keys.keys.length,
  });
});

export { adminRoutes };
