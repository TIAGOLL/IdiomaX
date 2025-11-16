import { z } from 'zod'

// ===== SUBMIT TASK (Student) =====
export const SubmitTaskApiRequestSchema = z.object({
    task_id: z.string().uuid('ID da tarefa inválido'),
    registration_id: z.string().uuid('ID da matrícula inválido'),
    company_id: z.string().uuid('ID da empresa inválido'),
    link: z.string().url('Link inválido').optional(),
})

export const SubmitTaskApiResponseSchema = z.object({
    message: z.string(),
    submission_id: z.string(),
})

export type SubmitTaskRequestType = z.infer<typeof SubmitTaskApiRequestSchema>
export type SubmitTaskResponseType = z.infer<typeof SubmitTaskApiResponseSchema>
