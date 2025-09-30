import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from './../../../types/error-response-schema';
import { GetClassApiRequestSchema, GetClassApiResponseSchema } from '@idiomax/validation-schemas/class/get-class';
export async function getClass(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/class',
            {
                schema: {
                    tags: ['Class'],
                    summary: 'Listar turmas',
                    querystring: GetClassApiRequestSchema,
                    response: {
                        200: GetClassApiResponseSchema,
                        400: ErrorResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.query

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Class')) {
                    throw new ForbiddenError()
                }

                const ResClass = await prisma.renamedclass.findMany({
                    where: {
                        courses: {
                            company_id: company_id
                        }
                    },
                    include: {
                        _count: { select: { users_in_class: true } },
                        courses: true
                    },
                })
                console.log(ResClass)
                return reply.status(200).send(ResClass)
            }
        )
}