import { z } from 'zod';

export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, 'Invalid date')
  .refine((date) => {
    const parsed = new Date(date);
    return parsed <= new Date();
  }, 'Birth date cannot be in the future')
  .refine((date) => {
    const parsed = new Date(date);
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 150);
    return parsed >= hundredYearsAgo;
  }, 'Birth date is too far in the past');

export const countryCodeSchema = z
  .string()
  .length(2, 'Country code must be 2 characters')
  .regex(/^[A-Z]{2}$/, 'Country code must be uppercase letters');

export const minAgeSchema = z
  .number()
  .int()
  .min(0, 'Minimum age must be at least 0')
  .max(150, 'Minimum age must be at most 150');

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const emailSchema = z.string().email('Invalid email format');

export const apiKeySchema = z.string().min(32, 'API key must be at least 32 characters');

export const proofBytesSchema = z
  .string()
  .regex(/^[0-9a-f]+$/, 'Proof must be hexadecimal')
  .refine((s) => s.length >= 64, 'Proof is too short')
  .refine((s) => s.length <= 10000, 'Proof is too long');

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}
