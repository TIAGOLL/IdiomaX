import { z } from 'zod'

// API Schema para requisição na API
export const AdminDashboardApiRequestSchema = z.object({
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const AdminDashboardApiResponseSchema = z.object({
    active_students: z.number(),
    new_registrations: z.number(),
    completed_registrations: z.number(),
    avg_class_occupation: z.number(),
    class_occupation: z.object({
        low: z.number(),
        ideal: z.number(),
        high: z.number(),
    }),
    avg_attendance: z.number(),
    top_attendance_classes: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        attendance: z.number()
    })),
    bottom_attendance_classes: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        attendance: z.number()
    })),
    teacher_workload: z.array(z.object({
        name: z.string(),
        hours: z.number()
    })),
    classes: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        vacancies: z.number(),
        students: z.number(),
        occupation: z.number(),
        course_name: z.string(),
    })),
    class_days: z.array(z.object({
        id: z.string(),
        class_name: z.string(),
        initial_date: z.date(),
        final_date: z.date(),
    })),
    low_attendance_students: z.array(z.object({
        id: z.string(),
        name: z.string(),
        attendanceRate: z.number(),
        className: z.string(),
    })),
    monthly_revenue: z.array(z.object({
        month: z.string(),
        revenue: z.number(),
    })),
})

// HTTP Schema para serviços do frontend
export const AdminDashboardHttpRequestSchema = z.object({
    companyId: z.string(),
})

export const AdminDashboardHttpResponseSchema = z.object({
    activeStudents: z.number(),
    newRegistrations: z.number(),
    completedRegistrations: z.number(),
    avgClassOccupation: z.number(),
    classOccupation: z.object({
        low: z.number(),
        ideal: z.number(),
        high: z.number(),
    }),
    avgAttendance: z.number(),
    topAttendanceClasses: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        attendance: z.number()
    })),
    bottomAttendanceClasses: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        attendance: z.number()
    })),
    teacherWorkload: z.array(z.object({
        name: z.string(),
        hours: z.number()
    })),
    classes: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        vacancies: z.number(),
        students: z.number(),
        occupation: z.number(),
        courseName: z.string(),
    })),
    classDays: z.array(z.object({
        id: z.string(),
        className: z.string(),
        initialDate: z.string(),
        finalDate: z.string(),
    })),
    lowAttendanceStudents: z.array(z.object({
        id: z.string(),
        name: z.string(),
        attendanceRate: z.number(),
        className: z.string(),
    })),
    monthlyRevenue: z.array(z.object({
        month: z.string(),
        revenue: z.number(),
    })),
})

// Types
export type AdminDashboardApiRequestData = z.infer<typeof AdminDashboardApiRequestSchema>
export type AdminDashboardApiResponseData = z.infer<typeof AdminDashboardApiResponseSchema>
export type AdminDashboardHttpRequestData = z.infer<typeof AdminDashboardHttpRequestSchema>
export type AdminDashboardHttpResponseData = z.infer<typeof AdminDashboardHttpResponseSchema>