// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3030),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  VITE_OAUTH_CLIENT_ID: z.string(),
});

export const env = envSchema.parse(process.env);
