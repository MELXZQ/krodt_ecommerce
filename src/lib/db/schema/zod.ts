import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.date().or(z.string().datetime());
export const moneySchema = z.string().or(z.number());
