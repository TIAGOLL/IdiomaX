import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { GetBooksApiParamsSchema, GetBooksApiQuerySchema, GetBooksApiResponseSchema } from '@idiomax/http-schemas/materials/get-books';
import { prisma } from '../../../lib/prisma';

export async function getBooks(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/books/:companyId',
            {
                schema: {
                    tags: ['Materiais'],
                    summary: 'Obter lista de materiais/livros de uma empresa.',
                    security: [{ bearerAuth: [] }],
                    params: GetBooksApiParamsSchema,
                    querystring: GetBooksApiQuerySchema,
                    response: {
                        200: GetBooksApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(company_id, userId);

                const {
                    page = 1,
                    limit = 10,
                    search,
                    active,
                    level_id
                } = request.query || {};

                const offset = (page - 1) * limit;

                // Construir filtros
                const whereClause: Record<string, unknown> = {
                    levels: {
                        courses: {
                            companies_id: company.id,
                        }
                    }
                };

                if (active !== undefined) {
                    whereClause.active = active;
                }

                if (level_id) {
                    whereClause.levels_id = level_id;
                }

                if (search) {
                    whereClause.name = {
                        contains: search,
                        mode: 'insensitive'
                    };
                }

                // Buscar materiais
                const [books, totalCount] = await Promise.all([
                    prisma.materials.findMany({
                        where: whereClause,
                        skip: offset,
                        take: limit,
                        orderBy: { name: 'asc' },
                        select: {
                            id: true,
                            name: true,
                            file: true,
                            levels_id: true,
                            active: true,
                            created_at: true,
                            updated_at: true,
                            created_by: true,
                            updated_by: true,
                            levels: {
                                select: {
                                    id: true,
                                    name: true,
                                    level: true,
                                }
                            }
                        }
                    }),
                    prisma.materials.count({ where: whereClause })
                ]);

                const totalPages = Math.ceil(totalCount / limit);

                // Converter bytes para base64 e mapear campos
                const booksWithBase64 = books.map(book => ({
                    id: book.id,
                    title: book.name,
                    description: null, // materials não tem description, usar null
                    level_id: book.levels_id,
                    company_id: company.id,
                    active: book.active,
                    created_at: book.created_at,
                    updated_at: book.updated_at,
                }));

                return reply.status(200).send({
                    books: booksWithBase64,
                    total_count: totalCount,
                    page,
                    limit,
                    total_pages: totalPages,
                });
            },
        );
}