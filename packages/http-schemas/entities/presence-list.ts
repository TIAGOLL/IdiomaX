import { z } from "zod";

// Schema de lista de presença
export const PresenceListSchema = z.object({
    id: z.string()
        .uuid({ message: 'ID da presença deve ser um UUID válido.' }),

    is_present: z.boolean({ message: 'Presença deve ser verdadeiro ou falso.' }),

    users_id: z.string()
        .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

    classes_id: z.string()
        .uuid({ message: 'ID da aula deve ser um UUID válido.' }),
});

// Schema para criação de presença
export const CreatePresenceSchema = PresenceListSchema.omit({
    id: true,
});

// Schema para atualização de presença
export const UpdatePresenceSchema = PresenceListSchema.partial()
    .extend({
        id: z.string().uuid({ message: 'ID da presença deve ser um UUID válido.' }),
    });

// Schema para marcar presença em lote
export const BulkPresenceSchema = z.object({
    classes_id: z.string()
        .uuid({ message: 'ID da aula deve ser um UUID válido.' }),

    presences: z.array(z.object({
        users_id: z.string()
            .uuid({ message: 'ID do usuário deve ser um UUID válido.' }),

        is_present: z.boolean({ message: 'Presença deve ser verdadeiro ou falso.' }),
    }))
        .min(1, { message: 'Deve haver pelo menos uma presença.' }),
});

// Tipos TypeScript
export type PresenceList = z.infer<typeof PresenceListSchema>;
export type CreatePresence = z.infer<typeof CreatePresenceSchema>;
export type UpdatePresence = z.infer<typeof UpdatePresenceSchema>;
export type BulkPresence = z.infer<typeof BulkPresenceSchema>;