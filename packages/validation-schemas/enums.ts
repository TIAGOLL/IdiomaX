import { z } from 'zod'

// ===== GENDER ENUMS =====
export const GenderEnum = z.enum(['M', 'F']) // Para API (alinhado com Prisma)

// ===== ROLE ENUMS =====
export const RoleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'OWNER'])

// ===== STRIPE ENUMS =====
export const StripePricingTypeEnum = z.enum(['one_time', 'recurring'])
export const StripePricingIntervalEnum = z.enum(['day', 'week', 'month', 'year'])

// ===== UTILITY TYPES =====
export type Gender = z.infer<typeof GenderEnum>
export type Role = z.infer<typeof RoleEnum>
export type StripePricingType = z.infer<typeof StripePricingTypeEnum>
export type StripePricingInterval = z.infer<typeof StripePricingIntervalEnum>