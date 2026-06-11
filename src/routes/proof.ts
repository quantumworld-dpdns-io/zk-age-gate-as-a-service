import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../index';

const proofRoutes = new Hono<{ Bindings: Bindings }>();

const generateProofSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  minAge: z.number().int().min(0).max(150),
  countryCode: z.string().length(2).optional(),
  circuitId: z.string().optional(),
});

const verifyProofSchema = z.object({
  proofId: z.string().uuid(),
  proof: z.string(),
});

proofRoutes.post('/generate', zValidator('json', generateProofSchema), async (c) => {
  const data = c.req.valid('json');
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const proofRecord = {
    id,
    circuitId: data.circuitId || 'age_range_v1',
    proof: `mock_proof_${id}`,
    publicOutputs: JSON.stringify({
      ageVerified: true,
      minAge: data.minAge,
      countryCode: data.countryCode,
      timestamp: Math.floor(now.getTime() / 1000),
    }),
    status: 'active' as const,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await c.env.DB.prepare(
    'INSERT INTO proofs (id, circuit_id, proof, public_outputs, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(
      proofRecord.id,
      proofRecord.circuitId,
      proofRecord.proof,
      proofRecord.publicOutputs,
      proofRecord.status,
      proofRecord.createdAt,
      proofRecord.expiresAt,
    )
    .run();

  return c.json(
    {
      id: proofRecord.id,
      proof: proofRecord.proof,
      publicOutputs: JSON.parse(proofRecord.publicOutputs),
      circuitId: proofRecord.circuitId,
      createdAt: proofRecord.createdAt,
      expiresAt: proofRecord.expiresAt,
    },
    201,
  );
});

proofRoutes.post('/verify', zValidator('json', verifyProofSchema), async (c) => {
  const data = c.req.valid('json');

  const proof = await c.env.DB.prepare('SELECT * FROM proofs WHERE id = ?')
    .bind(data.proofId)
    .first();

  if (!proof) {
    return c.json({ error: 'Proof not found' }, 404);
  }

  const now = new Date();
  const expiresAt = new Date(proof.expires_at as string);
  const isValid = proof.status === 'active' && expiresAt > now;

  return c.json({
    valid: isValid,
    proofId: proof.id,
    verifiedAt: now.toISOString(),
    publicOutputs: JSON.parse(proof.public_outputs as string),
  });
});

proofRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const proof = await c.env.DB.prepare('SELECT * FROM proofs WHERE id = ?').bind(id).first();

  if (!proof) {
    return c.json({ error: 'Proof not found' }, 404);
  }

  return c.json({
    id: proof.id,
    circuitId: proof.circuit_id,
    status: proof.status,
    publicOutputs: JSON.parse(proof.public_outputs as string),
    createdAt: proof.created_at,
    expiresAt: proof.expires_at,
  });
});

proofRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');

  await c.env.DB.prepare('UPDATE proofs SET status = ? WHERE id = ?').bind('revoked', id).run();

  return c.json({ message: 'Proof revoked', proofId: id });
});

export { proofRoutes };
