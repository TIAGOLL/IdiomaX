import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from '../../../middlewares/auth';
import { prisma } from '../../../services/prisma';
import { getUserPermissions } from '../../../lib/get-user-permission';
import { ForbiddenError } from '../_errors/forbidden-error';
import { GetMaterialsByLevelApiRequestSchema, GetMaterialsByLevelApiResponseSchema } from '@idiomax/validation-schemas/materials/get-materials-by-level';

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
                    querystring: GetMaterialsByLevelApiRequestSchema,
                    response: {
                        200: GetMaterialsByLevelApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, level_id } = request.query;

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Material')) {
                    throw new ForbiddenError()
                }

                const materials = await prisma.materials.findMany({
                    where: {
                        levels: {
                            id: level_id,
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