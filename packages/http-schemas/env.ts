import z from "zod";

export const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  PASS_MAIL_SENDER: z.string().min(1),
  PORT_MAIL_SENDER: z.string().min(1),
  USER_MAIL_SENDER: z.string().min(1),
  HOST_MAIL_SENDER: z.string().min(1),
  VERCEL: z.enum(['1', '0']).default('0'),
  STRIPE_SECRET_KEY: z.string().min(1),

  // Nome e endereço que vai aparecer para o usuário
  APP_NAME: z.string().min(1),
  ADDRESS_MAIL_SENDER: z.string().min(1),
  WEB_URL: z.url(),
})