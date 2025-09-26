import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteClassroomApiRequestSchema, DeleteClassroomApiResponseSchema, } from '@idiomax/http-schemas/classrooms/delete-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

export async function deleteClassroom(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .delete(
            '/classroom/:id',
            {
                schema: {
                    tags: ['Classrooms'],
                    summary: 'Deletar sala de aula',
                    body: DeleteClassroomApiRequestSchema,
                    response: {
                        200: DeleteClassroomApiResponseSchema,
                        404: DeleteClassroomApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { id, companies_id } = request.body
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(companies_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('delete', 'Classroom')) {
                    throw new ForbiddenError()
                }
                
                await prisma.classrooms.delete({
                    where: { id, companies_id },
                })

                return reply.status(200).send({ message: 'Sala de aula removida com sucesso!', })
            },
        )
}