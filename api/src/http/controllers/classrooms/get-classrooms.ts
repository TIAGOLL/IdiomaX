import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { GetClassroomsResponseSchema, GetClassroomsQuerySchema } from '@idiomax/http-schemas/classrooms/get-classrooms'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { z } from 'zod'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function getClassrooms(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            '/classrooms',
            {
                schema: {
                    tags: ['Classrooms'],
                    summary: 'Listar salas de aula',
                    querystring: GetClassroomsQuerySchema,
                    response: {
                        200: GetClassroomsResponseSchema,
                        400: ErrorResponseSchema,
                    },
                },
            },
            async (request, reply) => {
                const { company_id } = request.query

                const userId = await request.getCurrentUserId()
                const { member } = await request.getUserMember(company_id)

                const { cannot } = getUserPermissions(userId, member.role)

                if (cannot('get', 'Classroom')) {
                    throw new ForbiddenError()
                }

                const classrooms = await prisma.classrooms.findMany({
                    where: {
                        company_id
                    },
                    orderBy: [
                        { block: 'asc' },
                        { number: 'asc' }
                    ]
                })

                // Converter Decimal para number e ajustar formato para o schema
                const classroomsConverted = classrooms.map(classroom => ({
                    id: classroom.id,
                    number: Number(classroom.number),
                    block: classroom.block,
                    company_id: classroom.company_id,
                    created_at: classroom.created_at,
                    updated_at: classroom.updated_at,
                    active: classroom.active
                }))

                return reply.status(200).send(classroomsConverted)
            }
        )
}