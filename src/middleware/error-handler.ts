import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

export function errorHandler(): (err: Error, c: Context) => Response | Promise<Response> {
  return (err: Error, c: Context): Response | {
    status: StatusCode;
    body: { error: string; message: string; requestId: string | undefined };
  } => {
    console.error('Unhandled error:', err);

    const status = 500 as StatusCode;
    return c.json(
      {
        error: 'Internal Server Error',
        message: c.env.ENVIRONMENT === 'production' ? 'An unexpected error occurred' : err.message,
        requestId: c.get('requestId'),
      },
      status,
    );
  };
}
