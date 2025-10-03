import { z } from 'zod'

// Schema para validar formato de horário HH:MM
const TimeSchema = z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)')
    .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, 'Horário deve estar entre 00:00 e 23:59');

// Schema para um dia da semana com horários
const ClassDaySchema = z.object({
    week_date: z.enum(['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO']),
    start_time: TimeSchema,
    end_time: TimeSchema
}).refine((data) => {
    // Validar se horário de início é menor que horário de fim
    const [startHours, startMinutes] = data.start_time.split(':').map(Number);
    const [endHours, endMinutes] = data.end_time.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return startTotalMinutes < endTotalMinutes;
}, {
    message: 'Horário de início deve ser menor que horário de término',
    path: ['end_time'] // Mostra erro no campo end_time
});

// Schema para array de dias da semana com validações avançadas
const ClassDaysArraySchema = z.array(ClassDaySchema)
    .optional()
    .refine((days) => {
        if (!days || days.length === 0) return true;

        // Verificar se não há horários sobrepostos no mesmo dia
        const dayGroups = new Map<string, typeof days>();

        days.forEach(day => {
            if (!dayGroups.has(day.week_date)) {
                dayGroups.set(day.week_date, []);
            }
            dayGroups.get(day.week_date)!.push(day);
        });

        // Para cada dia, verificar sobreposição de horários
        for (const [weekDate, daySchedules] of dayGroups) {
            if (daySchedules.length <= 1) continue;

            // Converter horários para minutos para facilitar comparação
            const schedules = daySchedules.map(schedule => {
                const [startH, startM] = schedule.start_time.split(':').map(Number);
                const [endH, endM] = schedule.end_time.split(':').map(Number);
                return {
                    start: startH * 60 + startM,
                    end: endH * 60 + endM
                };
            });

            // Verificar sobreposição
            for (let i = 0; i < schedules.length; i++) {
                for (let j = i + 1; j < schedules.length; j++) {
                    const schedule1 = schedules[i];
                    const schedule2 = schedules[j];

                    // Verificar se há sobreposição
                    if (schedule1.start < schedule2.end && schedule2.start < schedule1.end) {
                        return false;
                    }
                }
            }
        }

        return true;
    }, {
        message: 'Há conflito de horários no mesmo dia da semana'
    });

// ===== FORM SCHEMAS (Frontend Formulários) =====
export const CreateClassFormSchema = z.object({
    name: z.string()
        .min(1, 'Nome da turma é obrigatório')
        .max(256, 'Nome muito longo')
        .trim(),
    vacancies: z.number()
        .min(0, 'Vagas não pode ser negativo')
        .int('Vagas deve ser um número inteiro'),
    course_id: z.string().uuid('ID do curso inválido'),
    class_days: ClassDaysArraySchema,
    users_in_class: z.array(z.object({
        user_id: z.string().uuid(),
        teacher: z.boolean()
    })).optional(),
})

// ===== API SCHEMAS (Backend Validation) =====
export const CreateClassApiRequestSchema = z.object({
    name: z.string().min(1).max(256).trim(),
    vacancies: z.number().min(0).int(),
    course_id: z.string().uuid(),
    company_id: z.string().uuid(),
    class_days: ClassDaysArraySchema,
    users_in_class: z.array(z.object({
        user_id: z.string().uuid(),
        teacher: z.boolean()
    })).optional(),
})

export const CreateClassApiResponseSchema = z.object({
    message: z.string(),
})

// ===== HTTP TYPES (Frontend Services) =====
export type CreateClassRequestType = z.infer<typeof CreateClassApiRequestSchema>
export type CreateClassResponseType = z.infer<typeof CreateClassApiResponseSchema>
