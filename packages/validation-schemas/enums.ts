import { z } from 'zod'

export const GenderEnum = z.enum(['M', 'F'], {
    error: 'Selecione um gênero válido'
})

export const RoleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
    error: 'Selecione uma função válida'
})

export const WeekDaysEnum = z.enum(["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"], {
    error: 'Selecione um dia da semana válido'
})

// ===== STRIPE ENUMS =====
export const StripePricingTypeEnum = z.enum(['one_time', 'recurring'])
export const StripePricingIntervalEnum = z.enum(['day', 'week', 'month', 'year'])

// ===== INFER TYPES =====
export type Gender = z.infer<typeof GenderEnum>
export type Role = z.infer<typeof RoleEnum>
export type StripePricingType = z.infer<typeof StripePricingTypeEnum>
export type StripePricingInterval = z.infer<typeof StripePricingIntervalEnum>