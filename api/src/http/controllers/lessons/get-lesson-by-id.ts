import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetLessonByIdApiRequestSchema, GetLessonByIdApiResponseSchema } from '@idiomax/validation-schemas/lessons/get-lesson-by-id'
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { NotFoundError } from '../_errors/not-found-error';
import { z } from 'zod';

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getLessonById(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/lesson',
            {
                schema: {
                    tags: ['Lessons'],
                    summary: 'Obter aula por ID',
                    security: [{ bearerAuth: [] }],
                    querystring: GetLessonByIdApiRequestSchema,
                    response: {
                        200: GetLessonByIdApiResponseSchema,
                        404: ErrorResponseSchema,
                        403: ErrorResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, id } = request.query;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Classroom')) { // Usando Classroom como referência de permissão
                    throw new ForbiddenError()
                }

                const lesson = await prisma.classes.findFirst({
                    where: {
                        id: id,
                        active: true,
                        class: {
                            courses: {
                                company_id: company_id
                            }
                        }
                    },
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
                                },
                                users_in_class: {
                                    select: {
                                        user_id: true,
                                        teacher: true,
                                        users: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        presence_list: {
                            select: {
                                id: true,
                                is_present: true,
                                user_id: true,
                                users: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            },
                            orderBy: {
                                users: {
                                    name: 'asc'
                                }
                            }
                        }
                    }
                });

                if (!lesson) {
                    throw new NotFoundError('Aula não encontrada.')
                }

                // Normalizar dados para evitar problemas de serialização
                const normalizedLesson = {
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
                        },
                        users_in_class: lesson.class.users_in_class.map(user => ({
                            user_id: user.user_id,
                            teacher: user.teacher,
                            users: {
                                id: user.users.id,
                                name: user.users.name,
                                email: user.users.email
                            }
                        }))
                    },
                    presence_list: lesson.presence_list.map(presence => ({
                        id: presence.id,
                        is_present: presence.is_present,
                        user_id: presence.user_id,
                        users: {
                            id: presence.users.id,
                            name: presence.users.name,
                            email: presence.users.email
                        }
                    }))
                };

                return reply.send(normalizedLesson);
            }
        );
}