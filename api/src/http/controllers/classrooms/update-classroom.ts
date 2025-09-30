import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateClassroomApiRequestSchema, UpdateClassroomApiResponseSchema, } from '@idiomax/validation-schemas/classrooms/update-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

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
                        400: UpdateClassroomApiResponseSchema,
                        404: UpdateClassroomApiResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { id, number, block, company_id } = request.body

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('update', 'Classroom')) {
                    throw new ForbiddenError()
                }

                // Verificar se já existe outra sala com esse número na mesma empresa
                const duplicateClassroom = await prisma.classrooms.findFirst({
                    where: {
                        company_id,
                        number: number,
                        active: true,
                        id: { not: id }
                    }
                })

                if (duplicateClassroom) {
                    throw new BadRequestError('Já existe outra sala com esse número nesta empresa')
                }

                const res = await prisma.classrooms.update({
                    where: { id },
                    data: {
                        number: number,
                        block: block,
                        updated_by: userId,
                    },
                })

                if (!res) {
                    throw new BadRequestError('Erro ao atualizar sala de aula')
                }

                return reply.status(200).send({ message: 'Sala de aula atualizada com sucesso!', })
            },
        )
}