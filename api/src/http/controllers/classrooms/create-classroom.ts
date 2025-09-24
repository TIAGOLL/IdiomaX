import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateClassroomApiRequestSchema, CreateClassroomResponseSchema } from '@idiomax/http-schemas/classrooms/create-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function createClassroom(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post(
            '/classroom',
            {
                schema: {
                    tags: ['Classrooms'],
                    summary: 'Criar uma nova sala de aula',
                    body: CreateClassroomApiRequestSchema,
                    response: {
                        201: CreateClassroomResponseSchema,
                        400: ErrorResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const userId = await request.getCurrentUserId()
                const { companies_id, number, block } = request.body

                // Verificar se já existe uma sala com esse número na mesma empresa
                const existingClassroom = await prisma.classrooms.findFirst({
                    where: {
                        companies_id,
                        number,
                        active: true
                    }
                })

                if (existingClassroom) {
                    throw new BadRequestError('Já existe uma sala com esse número nesta empresa')
                }

                await prisma.classrooms.create({
                    data: {
                        number,
                        block,
                        companies_id,
                        created_by: userId,
                        updated_by: userId,
                    },
                })

                return reply.status(201).send({ message: 'Sala de aula criada com sucesso!', })
            },
        )
}