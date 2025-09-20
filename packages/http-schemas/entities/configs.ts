import { z } from "zod";

// Schema de configurações
export const ConfigsSchema = z.object({
    id: z
        .uuid({ message: 'ID da configuração deve ser um UUID válido.' }),

    registrations_time: z.number()
        .int({ message: 'Tempo de matrícula deve ser um número inteiro.' })
        .min(1, { message: 'Tempo de matrícula deve ser pelo menos 1.' })
        .max(999999, { message: 'Tempo de matrícula deve ter no máximo 6 dígitos.' })
        .default(6),

    companies_id: z
        .uuid({ message: 'ID da empresa deve ser um UUID válido.' }),
});

// Schema para criação de configuração
export const CreateConfigSchema = ConfigsSchema.omit({
    id: true,
});

// Schema para atualização de configuração
export const UpdateConfigSchema = ConfigsSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID da configuração deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type Config = z.infer<typeof ConfigsSchema>;
export type CreateConfig = z.infer<typeof CreateConfigSchema>;
export type UpdateConfig = z.infer<typeof UpdateConfigSchema>;