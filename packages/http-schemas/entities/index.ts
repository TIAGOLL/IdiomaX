// Exportações de campos base
export * from '../lib/audit-fields';
export * from '../lib/decimal';

// Exportações de usuários e membros
export * from './users';
export * from './members';

// Exportações de empresas
export * from './companies';
export * from './classrooms';
export * from './configs';

// Exportações de cursos e estrutura acadêmica
export * from './courses';
export * from './levels';
export * from './disciplines';
export * from './materials';

// Exportações de turmas e aulas
export * from './classes';
export * from './class-days';
export * from './class-sessions';
export * from './users-in-class';
export * from './presence-list';

// Exportações de matrículas e financeiro
export * from './registrations';
export * from './monthly-fee';
export * from './records-of-students';

// Exportações de tarefas
export * from './tasks';
export * from './tasks-delivery';

// Exportações de sistema
export * from './tokens';

// Exportações do Stripe
export * from './stripe-products';
export * from './stripe-prices';
export * from './stripe-customers';
export * from './stripe-subscriptions';

// Schemas comuns para validações
export const IdSchema = {
    uuid: (fieldName: string = 'ID') =>
        import('zod').then(({ z }) =>
            z.uuid({ message: `${fieldName} deve ser um UUID válido.` })
        ),
};

export const CommonValidations = {
    name: (fieldName: string = 'Nome', minLength: number = 2, maxLength: number = 256) =>
        import('zod').then(({ z }) =>
            z.string()
                .min(minLength, { message: `${fieldName} deve ter pelo menos ${minLength} caracteres.` })
                .max(maxLength, { message: `${fieldName} deve ter no máximo ${maxLength} caracteres.` })
        ),

    email: (fieldName: string = 'Email') =>
        import('zod').then(({ z }) =>
            z.string()
                .email({ message: `${fieldName} deve ser um endereço válido.` })
                .max(256, { message: `${fieldName} deve ter no máximo 256 caracteres.` })
        ),

    phone: (fieldName: string = 'Telefone') =>
        import('zod').then(({ z }) =>
            z.string()
                .min(10, { message: `${fieldName} deve ter pelo menos 10 dígitos.` })
                .max(15, { message: `${fieldName} deve ter no máximo 15 dígitos.` })
                .regex(/^\d+$/, { message: `${fieldName} deve conter apenas números.` })
        ),

    currency: (fieldName: string = 'Valor', max: number = 999999.99) =>
        import('zod').then(({ z }) =>
            z.number()
                .min(0, { message: `${fieldName} deve ser maior ou igual a zero.` })
                .max(max, { message: `${fieldName} deve ser no máximo R$ ${max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.` })
        ),

    percentage: (fieldName: string = 'Porcentagem') =>
        import('zod').then(({ z }) =>
            z.number()
                .min(0, { message: `${fieldName} deve ser maior ou igual a zero.` })
                .max(100, { message: `${fieldName} deve ser no máximo 100%.` })
        ),
};

// Tipos de resposta padrão
export const ResponseSchemas = {
    success: () =>
        import('zod').then(({ z }) =>
            z.object({
                message: z.string(),
                success: z.boolean().default(true),
            })
        ),

    error: () =>
        import('zod').then(({ z }) =>
            z.object({
                message: z.string(),
                error: z.string().optional(),
                success: z.boolean().default(false),
            })
        ),

    pagination: () =>
        import('zod').then(({ z }) =>
            z.object({
                page: z.number().int().min(1),
                limit: z.number().int().min(1).max(100),
                total: z.number().int().min(0),
                totalPages: z.number().int().min(0),
            })
        ),
};

// Utilitários para criação de schemas
export const createPaginatedResponse = async <T>(dataSchema: T) => {
    const { z } = await import('zod');
    const paginationSchema = await ResponseSchemas.pagination();

    return z.object({
        data: z.array(dataSchema as any),
        pagination: paginationSchema,
    });
};

export const createApiResponse = async <T>(dataSchema: T) => {
    const { z } = await import('zod');

    return z.object({
        data: dataSchema as any,
        message: z.string().optional(),
        success: z.boolean().default(true),
    });
};