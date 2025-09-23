import { z } from 'zod'

// API Schema para requisição na API
export const AdminDashboardApiRequestSchema = z.object({
    company_id: z.string().uuid(),
})

// API Schema para resposta da API
export const AdminDashboardApiResponseSchema = z.object({
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
    topAttendanceClasses: z.array(z.object({ id: z.string(), nome: z.string(), attendance: z.number() })),
    bottomAttendanceClasses: z.array(z.object({ id: z.string(), nome: z.string(), attendance: z.number() })),
    teacherWorkload: z.array(z.object({ name: z.string(), hours: z.number() })),
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
        initial_date: z.date(),
        final_date: z.date(),
    })),
    alertLowOccupation: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        occupation: z.number(),
    })),
    lockedRegistrations: z.number(),
    alertHighOccupation: z.array(z.object({
        id: z.string(),
        nome: z.string(),
        occupation: z.number(),
    })),
    mrrDue: z.number(),
    mrrReceived: z.number(),
    mrrOpen: z.number(),
    aging: z.object({
        "0-30": z.number(),
        "31-60": z.number(),
        "61-90": z.number(),
        "90+": z.number(),
    }),
    dso: z.number(),
    defaultRate: z.number(),
    receivablesCurve: z.array(z.object({ month: z.string(), value: z.number() })),
    receivedCurve: z.array(z.object({ month: z.string(), value: z.number() })),
    earlyDiscount: z.number(),
    paymentMix: z.array(z.object({ method: z.string(), percent: z.number() })),
    avgTicket: z.number(),
    registrations: z.array(z.object({
        id: z.string(),
        locked: z.boolean(),
        completed: z.boolean(),
        daysSinceStart: z.number(),
        monthly_fee_amount: z.number().nullable(),
    })),
    lowAttendanceStudents: z.array(z.object({
        id: z.string(),
        name: z.string(),
        attendance: z.number(),
    })),
    classMeetings: z.array(z.object({
        classId: z.string(),
        className: z.string(),
        scheduled: z.number(),
        done: z.number(),
    })),
    tasksByDiscipline: z.array(z.object({
        disciplineId: z.string(),
        disciplineName: z.string(),
        deliveries: z.number(),
    })),
    pendingTasks: z.array(z.object({
        period: z.string(),
        count: z.number(),
    })),
})

export type AdminDashboardApiRequest = z.infer<typeof AdminDashboardApiRequestSchema>
export type AdminDashboardApiResponse = z.infer<typeof AdminDashboardApiResponseSchema>