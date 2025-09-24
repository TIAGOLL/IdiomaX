import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateClassroomApiRequestSchema, UpdateClassroomApiResponseSchema, } from '@idiomax/http-schemas/classrooms/update-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateClassroom(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put(
            '/classroom',
            {
                schema: {
                    tags: ['Classrooms'],
                    summary: 'Atualizar sala de aula',
                    body: UpdateClassroomApiRequestSchema,
                    response: {
                        200: UpdateClassroomApiResponseSchema,
                        400: ErrorResponseSchema,
                        404: ErrorResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId()
                const { id, number, block, companies_id } = request.body

                // Verificar se já existe outra sala com esse número na mesma empresa
                const duplicateClassroom = await prisma.classrooms.findFirst({
                    where: {
                        companies_id,
                        number: number,
                        active: true,
                        id: { not: id }
                    }
                })

                if (duplicateClassroom) {
                    throw new BadRequestError('Já existe outra sala com esse número nesta empresa')
                }

                await prisma.classrooms.update({
                    where: { id },
                    data: {
                        number: number,
                        block: block,
                        updated_by: userId,
                    },
                })

                return reply.status(200).send({ message: 'Sala de aula atualizada com sucesso!', })
            },
        )
}