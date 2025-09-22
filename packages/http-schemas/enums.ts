import { z } from 'zod'

// ===== GENDER ENUMS =====
export const GenderEnum = z.enum(['MASCULINO', 'FEMININO', 'OUTRO'])
export const GenderApiEnum = z.enum(['M', 'F']) // Para API (alinhado com Prisma)

// ===== ROLE ENUMS =====
export const RoleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN'])

// ===== STRIPE ENUMS =====
export const StripePricingTypeEnum = z.enum(['one_time', 'recurring'])
export const StripePricingIntervalEnum = z.enum(['day', 'week', 'month', 'year'])

// ===== UTILITY TYPES =====
export type Gender = z.infer<typeof GenderEnum>
export type GenderApi = z.infer<typeof GenderApiEnum>
export type Role = z.infer<typeof RoleEnum>
export type StripePricingType = z.infer<typeof StripePricingTypeEnum>
export type StripePricingInterval = z.infer<typeof StripePricingIntervalEnum>