import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { GetCoursesApiRequestSchema, GetCoursesApiResponseSchema } from "@idiomax/validation-schemas/courses/get-courses"
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';

export async function getCourses(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/courses/:company_id',
            {
                schema: {
                    tags: ['Cursos'],
                    summary: 'Obter cursos de uma empresa.',
                    security: [{ bearerAuth: [] }],
                    params: GetCoursesApiRequestSchema,
                    response: {
                        200: GetCoursesApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Course')) {
                    throw new ForbiddenError()
                }

                const courses = await prisma.courses.findMany({
                    where: {
                        company_id: company_id,
                    },
                });

                const mappedCourses = courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    company_id: course.company_id,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    active: course.active,
                }));

                return reply.status(200).send(mappedCourses);
            },
        );
}
