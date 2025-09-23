import { z } from 'zod'
import { RoleEnum, GenderEnum } from '../enums'

// Schema para dados de empresa
const CompanySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    cnpj: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    owner_id: z.string(),
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