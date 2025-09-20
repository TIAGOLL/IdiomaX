import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { getBooksParams, getBooksQuery, getBooksResponse } from '@idiomax/http-schemas/get-books';
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
                    params: getBooksParams,
                    querystring: getBooksQuery,
                    response: {
                        200: getBooksResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId } = request.params;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(companyId, userId);

                const {
                    page = 1,
                    limit = 10,
                    search,
                    active,
                    levelId
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

                if (levelId) {
                    whereClause.levels_id = levelId;
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

                // Converter bytes para base64
                const booksWithBase64 = books.map(book => ({
                    ...book,
                    file: Buffer.from(book.file).toString('base64'),
                }));

                return reply.status(200).send({
                    books: booksWithBase64,
                    totalCount,
                    page,
                    limit,
                    totalPages,
                });
            },
        );
}