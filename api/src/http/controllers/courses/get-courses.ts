import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { GetCoursesApiParamsSchema, GetCoursesApiResponseSchema } from "@idiomax/http-schemas/courses/get-courses"
import { prisma } from '../../../lib/prisma';

export async function getCourses(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/courses/:companyId',
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
                const { company_id } = request.params;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(company_id, userId);

                const courses = await prisma.courses.findMany({
                    where: {
                        companies_id: company.id,
                    },
                });

                const mappedCourses = courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    company_id: course.companies_id,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    active: course.active,
                }));

                return reply.status(200).send(mappedCourses);
            },
        );
}
