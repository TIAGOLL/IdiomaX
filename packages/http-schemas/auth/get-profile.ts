import { z } from 'zod'
import { RoleEnum, GenderEnum } from '../enums'

// Schema para dados de empresa
const CompanySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(256),
    phone: z.string().min(10).max(15).regex(/^\d+$/),
    address: z.string().max(512),
    email: z.string().email().max(256).nullable().optional(),
    logo_16x16_url: z.string().max(512).nullable().optional(),
    logo_512x512_url: z.string().max(512).nullable().optional(),
    social_reason: z.string().max(256).nullable().optional(),
    state_registration: z.string().max(256).nullable().optional(),
    tax_regime: z.string().max(256).nullable().optional(),
    cnpj: z.string().min(14).max(14),
})

// Schema para dados de membro
const MemberSchema = z.object({
    id: z.string().uuid(),
    role: RoleEnum,
    company_id: z.string().uuid(),
    user_id: z.string().uuid(),
    company: CompanySchema,
})

// API Schema para resposta da API
export const GetProfileApiResponse = z.object({
    id: z.string().uuid(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    cpf: z.string(),
    phone: z.string(),
    gender: GenderEnum,
    date_of_birth: z.date(),
    address: z.string(),
    avatar_url: z.string(),
    member_on: z.array(MemberSchema),
})

// Types para serviços do frontend
export type GetProfileResponseType = z.infer<typeof GetProfileApiResponse>