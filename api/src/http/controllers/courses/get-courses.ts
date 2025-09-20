import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { checkMemberAccess } from '../../../lib/permissions';
import { getCourseParams, getCourseResponse } from "@idiomax/http-schemas/get-courses"
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
                    params: getCourseParams,
                    response: {
                        200: getCourseResponse,
                    },
                },
            },
            async (request, reply) => {
                const { companyId } = request.params;
                const userId = await request.getCurrentUserId();

                const { company } = await checkMemberAccess(companyId, userId);

                const courses = await prisma.courses.findMany({
                    where: {
                        companies_id: company.id,
                    },
                });

                return reply.status(200).send(courses);
            },
        );
}
