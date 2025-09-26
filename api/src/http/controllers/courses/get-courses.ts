import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetCoursesApiParamsSchema, GetCoursesApiResponseSchema } from "@idiomax/http-schemas/courses/get-courses"
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getCourses(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/courses/:companies_id',
            {
                schema: {
                    tags: ['Cursos'],
                    summary: 'Obter cursos de uma empresa.',
                    security: [{ bearerAuth: [] }],
                    params: GetCoursesApiParamsSchema,
                    response: {
                        200: GetCoursesApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { companies_id } = request.params;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(companies_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Course')) {
                    throw new ForbiddenError()
                }

                const courses = await prisma.courses.findMany({
                    where: {
                        companies_id: companies_id,
                    },
                });

                const mappedCourses = courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    companies_id: course.companies_id,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    active: course.active,
                }));

                return reply.status(200).send(mappedCourses);
            },
        );
}
