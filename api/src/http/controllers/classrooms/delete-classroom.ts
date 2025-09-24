import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DeleteClassroomApiRequestSchema, DeleteClassroomApiResponseSchema, } from '@idiomax/http-schemas/classrooms/delete-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'

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

                await prisma.classrooms.delete({
                    where: { id, companies_id },
                })

                return reply.status(200).send({ message: 'Sala de aula removida com sucesso!', })
            },
        )
}