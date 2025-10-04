import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { EditRegistrationApiRequestSchema, EditRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations/edit-registration'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { NotFoundError } from '../_errors/not-found-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function editRegistration(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/registrations', {
            schema: {
                tags: ['Registrations'],
                summary: 'Edit a registration',
                security: [{ bearerAuth: [] }],
                body: EditRegistrationApiRequestSchema,
                response: {
                    200: EditRegistrationApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                id,
                company_id,
                user_id,
                start_date,
                monthly_fee_amount,
                locked,
                completed
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('update', 'Registration')) {
                throw new ForbiddenError()
            }

            // Verificar se a inscrição existe
            const existingRegistration = await prisma.registrations.findFirst({
                where: {
                    id: id,
                    company_id: company_id,
                    active: true
                }
            });

            if (!existingRegistration) {
                throw new NotFoundError('Inscrição não encontrada');
            }

            // Verificar se o usuário existe
            const user = await prisma.users.findUnique({
                where: {
                    id: user_id
                }
            });

            if (!user) {
                throw new BadRequestError('Usuário não encontrado');
            }

            // Verificar se o usuário pertence à empresa
            const userMember = await prisma.members.findFirst({
                where: {
                    user_id: user_id,
                    company_id: company_id
                }
            });

            if (!userMember) {
                throw new BadRequestError('Usuário não pertence à empresa');
            }

            // Se está mudando o usuário, verificar se o novo usuário já tem inscrição ativa
            if (user_id !== existingRegistration.user_id) {
                const conflictingRegistration = await prisma.registrations.findFirst({
                    where: {
                        user_id: user_id,
                        company_id: company_id,
                        active: true,
                        completed: false,
                        id: {
                            not: id
                        }
                    }
                });

                if (conflictingRegistration) {
                    throw new BadRequestError('Usuário já possui uma inscrição ativa nesta empresa');
                }
            }

            await prisma.registrations.update({
                where: {
                    id: id
                },
                data: {
                    user_id,
                    start_date: new Date(start_date),
                    monthly_fee_amount,
                    locked: locked || false,
                    completed: completed || false,
                    updated_by: userId,
                }
            })

            return reply.status(200).send({
                message: 'Inscrição atualizada com sucesso!'
            })
        })
}