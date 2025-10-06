import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetLessonsApiRequestSchema, GetLessonsApiResponseSchema } from '@idiomax/validation-schemas/lessons/get-lessons'
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getLessons(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/lessons',
            {
                schema: {
                    tags: ['Lessons'],
                    summary: 'Obter aulas de uma empresa',
                    security: [{ bearerAuth: [] }],
                    querystring: GetLessonsApiRequestSchema,
                    response: {
                        200: GetLessonsApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, class_id } = request.query;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Classroom')) { // Usando Classroom como referência de permissão
                    throw new ForbiddenError()
                }

                const whereClause = {
                    active: true,
                    class: {
                        courses: {
                            company_id: company_id
                        }
                    },
                    ...(class_id && { class_id: class_id })
                }

                const lessons = await prisma.classes.findMany({
                    where: whereClause,
                    include: {
                        class: {
                            select: {
                                id: true,
                                name: true,
                                vacancies: true,
                                courses: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                presence_list: {
                                    where: {
                                        is_present: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        start_date: 'desc'
                    }
                });

                // Normalizar dados para evitar problemas de serialização
                const normalizedLessons = lessons.map(lesson => ({
                    id: lesson.id,
                    theme: lesson.theme,
                    start_date: lesson.start_date,
                    end_date: lesson.end_date,
                    class_id: lesson.class_id,
                    created_at: lesson.created_at,
                    updated_at: lesson.updated_at,
                    active: lesson.active,
                    class: {
                        id: lesson.class.id,
                        name: lesson.class.name,
                        vacancies: lesson.class.vacancies,
                        courses: {
                            name: lesson.class.courses.name
                        }
                    },
                    _count: {
                        presence_list: lesson._count.presence_list
                    }
                }));

                return reply.send(normalizedLessons);
            }
        );
}