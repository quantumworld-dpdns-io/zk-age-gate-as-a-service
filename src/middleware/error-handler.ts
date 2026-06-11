import { Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';

export function errorHandler() {
  return (err: Error, c: Context): Response => {
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
