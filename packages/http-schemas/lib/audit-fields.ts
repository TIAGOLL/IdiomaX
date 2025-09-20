import { z } from "zod";

/**
 * Campos base de auditoria que todos os modelos devem ter
 */
export const auditFieldsSchema = z.object({
    created_at: z.coerce.date()
        .default(() => new Date()),

    created_by: z.string()
        .uuid({ message: 'ID do usuário criador deve ser um UUID válido.' })
        .nullable()
        .optional(),

    updated_at: z.coerce.date()
        .default(() => new Date()),

    updated_by: z.string()
        .uuid({ message: 'ID do usuário atualizador deve ser um UUID válido.' })
        .nullable()
        .optional(),

    active: z.boolean()
        .default(true)
});

/**
 * Campos de auditoria para criação (excluindo updated_at e IDs opcionais)
 */
export const auditFieldsForCreate = auditFieldsSchema.omit({
    updated_at: true,
}).partial({
    created_by: true,
    updated_by: true
});

/**
 * Campos de auditoria para atualização (apenas updated_by e updated_at)
 */
export const auditFieldsForUpdate = auditFieldsSchema.pick({
    updated_at: true,
    updated_by: true
}).partial();

/**
 * Tipo TypeScript para campos de auditoria
 */
export type AuditFields = z.infer<typeof auditFieldsSchema>;
export type AuditFieldsForCreate = z.infer<typeof auditFieldsForCreate>;
export type AuditFieldsForUpdate = z.infer<typeof auditFieldsForUpdate>;