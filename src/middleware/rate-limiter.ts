import type { Context, Next } from 'hono';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function rateLimiter(): Promise<void> {
  return async (c: Context, next: Next): Promise<void> => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 100;

    const key = `rl:${ip}`;
    const entry = rateLimitMap.get(key);

    if (entry && entry.resetAt > now) {
      if (entry.count >= maxRequests) {
        c.header('X-RateLimit-Limit', String(maxRequests));
        c.header('X-RateLimit-Remaining', '0');
        c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));
        return c.json({ error: 'Rate limit exceeded' }, 429);
      }
      entry.count++;
    } else {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    }

    const current = rateLimitMap.get(key)!;
    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(maxRequests - current.count));
    c.header('X-RateLimit-Reset', String(Math.ceil(current.resetAt / 1000)));

    await next();
  };
}
