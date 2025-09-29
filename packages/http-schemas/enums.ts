import { z } from 'zod'

export const GenderEnum = z.enum(['M', 'F'], {
    error: 'Selecione um gênero válido'
})

export const RoleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'OWNER'], {
    error: 'Selecione uma função válida'
})

// ===== STRIPE ENUMS =====
export const StripePricingTypeEnum = z.enum(['one_time', 'recurring'])
export const StripePricingIntervalEnum = z.enum(['day', 'week', 'month', 'year'])

// ===== INFER TYPES =====
export type Gender = z.infer<typeof GenderEnum>
export type Role = z.infer<typeof RoleEnum>
export type StripePricingType = z.infer<typeof StripePricingTypeEnum>
export type StripePricingInterval = z.infer<typeof StripePricingIntervalEnum>