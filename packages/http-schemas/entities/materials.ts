import { z } from "zod";
import { auditFieldsSchema, auditFieldsForCreate, auditFieldsForUpdate } from "../lib/audit-fields";

// Schema de materiais
export const MaterialsSchema = z.object({
    id: z
        .uuid({ message: 'ID do material deve ser um UUID válido.' }),

    name: z.string()
        .min(1, { message: 'Nome do material deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Nome do material deve ter no máximo 256 caracteres.' }),

    file: z.string()
        .base64({ message: 'Arquivo deve ser válido em formato base64.' }),

    levels_id: z
        .uuid({ message: 'ID do nível deve ser um UUID válido.' })
        .nullable()
        .optional(),
})
    .merge(auditFieldsSchema);

// Schema para criação de material
export const CreateMaterialSchema = MaterialsSchema.omit({
    id: true,
}).merge(auditFieldsForCreate);

// Schema para atualização de material
export const UpdateMaterialSchema = MaterialsSchema.partial()
    .safeExtend({
        id: z.uuid({ message: 'ID do material deve ser um UUID válido.' }),
    })
    .merge(auditFieldsForUpdate);

// Schema para upload de material
export const UploadMaterialSchema = z.object({
    name: z.string()
        .min(1, { message: 'Nome do material deve ter pelo menos 1 caractere.' })
        .max(256, { message: 'Nome do material deve ter no máximo 256 caracteres.' }),

    file: z.any()
        .refine((file) => file instanceof File, { message: 'Deve ser um arquivo válido.' })
        .refine((file) => file.size <= 10 * 1024 * 1024, { message: 'Arquivo deve ter no máximo 10MB.' }),

    levels_id: z
        .uuid({ message: 'ID do nível deve ser um UUID válido.' })
        .nullable()
        .optional(),
});

// Tipos TypeScript
export type Material = z.infer<typeof MaterialsSchema>;
export type CreateMaterial = z.infer<typeof CreateMaterialSchema>;
export type UpdateMaterial = z.infer<typeof UpdateMaterialSchema>;
export type UploadMaterial = z.infer<typeof UploadMaterialSchema>;