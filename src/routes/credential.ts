import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../index';

const credentialRoutes = new Hono<{ Bindings: Bindings }>();

const issueCredentialSchema = z.object({
  holderId: z.string(),
  ageVerified: z.boolean(),
  minAge: z.number().int().min(0).max(150),
  countryCode: z.string().length(2).optional(),
});

const verifyCredentialSchema = z.object({
  credentialId: z.string().uuid(),
});

credentialRoutes.post('/issue', zValidator('json', issueCredentialSchema), async (c) => {
  const data = c.req.valid('json');
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'AgeVerificationCredential'],
    issuer: 'did:web:zk-age-gate.example.com',
    issuanceDate: now.toISOString(),
    expirationDate: expiresAt.toISOString(),
    credentialSubject: {
      id: `did:example:${data.holderId}`,
      ageVerified: data.ageVerified,
      minAge: data.minAge,
      countryCode: data.countryCode,
    },
  };

  await c.env.DB.prepare(
    'INSERT INTO credentials (id, holder_id, credential_data, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
    .bind(
      id,
      data.holderId,
      JSON.stringify(credential),
      'active',
      now.toISOString(),
      expiresAt.toISOString(),
    )
    .run();

  return c.json({ id, credential }, 201);
});

credentialRoutes.post('/verify', zValidator('json', verifyCredentialSchema), async (c) => {
  const data = c.req.valid('json');

  const cred = await c.env.DB.prepare('SELECT * FROM credentials WHERE id = ?')
    .bind(data.credentialId)
    .first();

  if (!cred) {
    return c.json({ error: 'Credential not found' }, 404);
  }

  const now = new Date();
  const expiresAt = new Date(cred.expires_at as string);
  const isValid = cred.status === 'active' && expiresAt > now;

  return c.json({
    valid: isValid,
    credentialId: cred.id,
    verifiedAt: now.toISOString(),
    credential: JSON.parse(cred.credential_data as string),
  });
});

credentialRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const cred = await c.env.DB.prepare('SELECT * FROM credentials WHERE id = ?').bind(id).first();

  if (!cred) {
    return c.json({ error: 'Credential not found' }, 404);
  }

  return c.json({
    id: cred.id,
    status: cred.status,
    credential: JSON.parse(cred.credential_data as string),
    createdAt: cred.created_at,
    expiresAt: cred.expires_at,
  });
});

credentialRoutes.post('/:id/revoke', async (c) => {
  const id = c.req.param('id');

  await c.env.DB.prepare('UPDATE credentials SET status = ? WHERE id = ?')
    .bind('revoked', id)
    .run();

  return c.json({ message: 'Credential revoked', credentialId: id });
});

export { credentialRoutes };
