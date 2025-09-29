import { z } from 'zod'

// API Schema para requisição na API
export const ApiDeleteStudentRequest = z.object({
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const ApiDeleteStudentResponse = z.object({
    message: z.string(),
})

// Types
export type ApiDeleteStudentRequestData = z.infer<typeof ApiDeleteStudentRequest>
export type ApiDeleteStudentResponseData = z.infer<typeof ApiDeleteStudentResponse>
// HTTP Types para serviços do frontend (usando z.infer dos schemas da API)
export type HttpDeleteStudentRequestData = z.infer<typeof ApiDeleteStudentRequest>
export type HttpDeleteStudentResponseData = z.infer<typeof ApiDeleteStudentResponse>