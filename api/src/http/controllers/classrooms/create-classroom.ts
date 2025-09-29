import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateClassroomApiRequestSchema, CreateClassroomResponseSchema } from '@idiomax/validation-schemas/classrooms/create-classroom'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

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
                        400: CreateClassroomResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id, number, block } = request.body
                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                // Verifica permissão explícita de criação de sala de aula
                if (cannot('create', 'Classroom')) {
                    throw new ForbiddenError()
                }

                // Verificar se já existe uma sala com esse número na mesma empresa
                const existingClassroom = await prisma.classrooms.findFirst({
                    where: {
                        company_id,
                        number,
                    }
                })

                if (existingClassroom) {
                    throw new BadRequestError('Já existe uma sala com esse número nesta empresa')
                }

                await prisma.classrooms.create({
                    data: {
                        number,
                        block,
                        company_id,
                        created_by: userId,
                        updated_by: userId,
                    },
                })

                return reply.status(201).send({ message: 'Sala de aula criada com sucesso!', })
            },
        )
}