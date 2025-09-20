import { z } from "zod";

// Schema de níveis
export const LevelsSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID do nível deve ser um UUID válido.' }),

    name: z.string()
        .min(1, { message: 'Nome do nível deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Nome do nível deve ter no máximo 256 caracteres.' }),

    level: z.number()
        .int({ message: 'Nível deve ser um número inteiro.' })
        .min(1, { message: 'Nível deve ser pelo menos 1.' })
        .max(99999, { message: 'Nível deve ter no máximo 5 dígitos.' }),

    courses_id: z.string()
        .uuid({ message: 'ID do curso deve ser um UUID válido.' })
        .nullable()
        .optional(),
});

// Schema para criação de nível
export const CreateLevelSchema = LevelsSchema.omit({
    id: true,
});

// Schema para atualização de nível
export const UpdateLevelSchema = LevelsSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID do nível deve ser um UUID válido.' }),
    });

// Tipos TypeScript
export type Level = z.infer<typeof LevelsSchema>;
export type CreateLevel = z.infer<typeof CreateLevelSchema>;
export type UpdateLevel = z.infer<typeof UpdateLevelSchema>;