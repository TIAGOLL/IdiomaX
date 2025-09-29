import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { GetMaterialsByLevelApiParamsSchema, GetMaterialsByLevelApiQuerySchema, GetMaterialsByLevelApiResponseSchema } from '@idiomax/http-schemas/materials/get-materials-by-level';

export async function getMaterialsByLevel(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/materials/:company_id',
            {
                schema: {
                    tags: ['Materiais'],
                    summary: 'Obter lista de materiais de um level.',
                    security: [{ bearerAuth: [] }],
                    params: GetMaterialsByLevelApiParamsSchema,
                    querystring: GetMaterialsByLevelApiQuerySchema,
                    response: {
                        200: GetMaterialsByLevelApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.params;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Material')) {
                    throw new ForbiddenError()
                }

                const materials = await prisma.materials.findMany({
                    where: {
                        levels: {
                            courses: {
                                company_id: company_id,
                            }
                        }
                    },
                    orderBy: { name: 'asc' },
                })

                return reply.status(200).send(materials);
            },
        );
}