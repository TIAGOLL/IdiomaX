import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateRegistrationApiRequestSchema, CreateRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations/create-registration'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'

export async function createRegistration(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/registrations', {
            schema: {
                tags: ['Registrations'],
                summary: 'Create a new registration',
                security: [{ bearerAuth: [] }],
                body: CreateRegistrationApiRequestSchema,
                response: {
                    201: CreateRegistrationApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                },
            },
        }, async (request, reply) => {
            const {
                company_id,
                user_id,
                start_date,
                monthly_fee_amount,
                locked,
                completed,
                end_date
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Registration')) {
                throw new ForbiddenError()
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

            // Verificar se já existe uma inscrição ativa para este usuário na empresa
            const existingRegistration = await prisma.registrations.findFirst({
                where: {
                    user_id: user_id,
                    company_id: company_id,
                    active: true,
                    completed: false
                }
            });

            if (existingRegistration) {
                throw new BadRequestError('Usuário já possui uma inscrição ativa nesta empresa');
            }

            await prisma.registrations.create({
                data: {
                    company_id,
                    user_id,

                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    monthly_fee_amount,
                    locked: locked || false,
                    completed: completed || false,
                    created_by: userId,
                    updated_by: userId,
                }
            })

            return reply.status(201).send({
                message: 'Inscrição criada com sucesso!'
            })
        })
}