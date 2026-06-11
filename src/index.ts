import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId } from 'hono/request-id';
import { timing } from 'hono/timing';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error-handler';
import { securityHeaders } from './middleware/security-headers';
import { rateLimiter } from './middleware/rate-limiter';
import { proofRoutes } from './routes/proof';
import { credentialRoutes } from './routes/credential';
import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';

export type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
  ARTIFACTS: R2Bucket;
  SEARCH_INDEX: VectorizeIndex;
  AI: Ai;
  PROOF_QUEUE: Queue;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  TURNSTILE_SECRET: string;
  JWT_SECRET: string;
  API_KEY_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', requestId());
app.use('*', timing());
app.use('*', logger());
app.use('*', cors());
app.use('*', securityHeaders());
app.use('*', rateLimiter());

app.onError(errorHandler());

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', async (c) => {
  try {
    await c.env.DB.prepare('SELECT 1').first();
    return c.json({ status: 'ready', timestamp: new Date().toISOString() });
  } catch {
    return c.json({ status: 'not ready', timestamp: new Date().toISOString() }, 503);
  }
});

app.get('/version', (c) => {
  return c.json({
    version: '0.1.0',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.route('/api/v1/proofs', proofRoutes);
app.route('/api/v1/credentials', credentialRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/admin', adminRoutes);

export default app;
