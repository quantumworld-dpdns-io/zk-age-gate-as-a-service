import type { Context, Next } from 'hono';

export async function logger(): Promise<void> {
  return async (c: Context, next: Next): Promise<void> => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    const method = c.req.method;
    const path = c.req.path;
    const status = c.res.status;
    const requestId = c.get('requestId') || 'unknown';

    console.log(
      JSON.stringify({
        method,
        path,
        status,
        duration,
        requestId,
        timestamp: new Date().toISOString(),
      }),
    );
  };
}
