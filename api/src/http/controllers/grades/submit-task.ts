import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { SubmitTaskApiRequestSchema, SubmitTaskApiResponseSchema } from '@idiomax/validation-schemas/grades'
import { prisma } from '../../../services/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'
import { BadRequestError } from '../_errors/bad-request-error'

export async function submitTask(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/tasks/submit', {
            schema: {
                tags: ['Grades'],
                summary: 'Marcar tarefa como entregue (aluno)',
                security: [{ bearerAuth: [] }],
                body: SubmitTaskApiRequestSchema,
                response: {
                    201: SubmitTaskApiResponseSchema,
                    403: ErrorResponseSchema,
                    400: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const { task_id, registration_id, company_id, link } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('submit', 'Task')) {
                throw new ForbiddenError('Você não tem permissão para submeter tarefas')
            }

            // Verificar se a matrícula pertence ao usuário
            const registration = await prisma.registrations.findFirst({
                where: {
                    id: registration_id,
                    user_id: userId,
                    company_id,
                    active: true,
                },
            })

            if (!registration) {
                throw new BadRequestError('Matrícula não encontrada ou não pertence a você')
            }

            // Verificar se já existe submissão
            const existingSubmission = await prisma.tasks_submitted.findFirst({
                where: {
                    task_id,
                    registration_id,
                    active: true,
                },
            })

            if (existingSubmission) {
                throw new BadRequestError('Você já submeteu esta tarefa')
            }

            // Criar submissão
            const submission = await prisma.tasks_submitted.create({
                data: {
                    task_id,
                    registration_id,
                    link: link || null,
                    date: new Date(),
                    active: true,
                    created_by: userId,
                    updated_by: userId,
                },
            })

            return reply.status(201).send({
                message: 'Tarefa submetida com sucesso',
                submission_id: submission.id,
            })
        })
}
