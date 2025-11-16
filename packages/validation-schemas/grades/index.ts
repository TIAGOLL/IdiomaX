import { z } from 'zod'

// ===== GET CLASS GRADES (Admin/Teacher) =====
export const GetClassGradesApiRequestSchema = z.object({
    class_id: z.string().uuid('ID da turma inválido'),
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const GetClassGradesApiResponseSchema = z.object({
    class: z.object({
        id: z.string(),
        name: z.string(),
        course_name: z.string(),
    }),
    students: z.array(z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        registration_id: z.string(),
        grades: z.array(z.object({
            task_id: z.string(),
            task_title: z.string(),
            task_value: z.number(),
            discipline_name: z.string(),
            level_name: z.string(),
            submit_date: z.string(),
            submission_id: z.string().nullable(),
            grade: z.number().nullable(),
            submitted_at: z.string().nullable(),
        })),
        average: z.number(),
        total_tasks: z.number(),
        completed_tasks: z.number(),
    })),
})

export type GetClassGradesRequestType = z.infer<typeof GetClassGradesApiRequestSchema>
export type GetClassGradesResponseType = z.infer<typeof GetClassGradesApiResponseSchema>

// ===== UPDATE GRADE (Admin/Teacher) =====
export const UpdateGradeApiRequestSchema = z.object({
    submission_id: z.string().uuid('ID da submissão inválido'),
    grade: z.number().min(0, 'Nota não pode ser negativa').max(100, 'Nota máxima é 100'),
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const UpdateGradeApiResponseSchema = z.object({
    message: z.string(),
})

export type UpdateGradeRequestType = z.infer<typeof UpdateGradeApiRequestSchema>
export type UpdateGradeResponseType = z.infer<typeof UpdateGradeApiResponseSchema>

// ===== GET STUDENT GRADES (Student) =====
export const GetStudentGradesApiRequestSchema = z.object({
    company_id: z.string().uuid('ID da empresa inválido'),
})

export const GetStudentGradesApiResponseSchema = z.object({
    registrations: z.array(z.object({
        id: z.string(),
        course_name: z.string(),
        start_date: z.string(),
        end_date: z.string(),
        completed: z.boolean(),
        locked: z.boolean(),
        grades: z.array(z.object({
            task_id: z.string(),
            task_title: z.string(),
            task_value: z.number(),
            discipline_name: z.string(),
            level_name: z.string(),
            submit_date: z.string(),
            grade: z.number().nullable(),
            submitted_at: z.string().nullable(),
            class_id: z.string(),
        })),
        average: z.number(),
        total_tasks: z.number(),
        completed_tasks: z.number(),
    })),
})

export type GetStudentGradesRequestType = z.infer<typeof GetStudentGradesApiRequestSchema>
export type GetStudentGradesResponseType = z.infer<typeof GetStudentGradesApiResponseSchema>

// ===== SUBMIT TASK (Student) =====
export * from './submit-task'
