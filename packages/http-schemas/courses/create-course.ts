import { z } from 'zod'

export const CreateCourseFormSchema = z.object({
    companies_id: z.string().uuid(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    description: z.string().optional(),
    registration_value: z.number().min(0, 'Valor da matrícula deve ser positivo'),
    workload: z.number().min(1, 'Carga horária deve ser maior que 0'),
    monthly_fee_value: z.number().min(0, 'Valor da mensalidade deve ser positivo'),
    minimum_grade: z.number().min(0, 'Nota mínima deve ser entre 0 e 100').max(100, 'Nota mínima deve ser entre 0 e 100'),
    maximum_grade: z.number().min(0, 'Nota máxima deve ser entre 0 e 100').max(100, 'Nota máxima deve ser entre 0 e 100'),
    minimum_frequency: z.number().min(0, 'Frequência mínima deve ser entre 0 e 100').max(100, 'Frequência mínima deve ser entre 0 e 100'),
    syllabus: z.string().optional()
})

export const CreateCourseApiRequestSchema = CreateCourseFormSchema

export const CreateCourseApiResponseSchema = z.object({
    message: z.string(),
})

export type CreateCourseApiRequest = z.infer<typeof CreateCourseApiRequestSchema>
export type CreateCourseApiResponse = z.infer<typeof CreateCourseApiResponseSchema>