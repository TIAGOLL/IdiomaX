import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CreateRegistrationApiRequestSchema, CreateRegistrationApiResponseSchema } from '@idiomax/validation-schemas/registrations/create-registration'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { getUserPermissions } from '../../../lib/get-user-permission'
import { ForbiddenError } from '../_errors/forbidden-error'
import { ErrorResponseSchema } from '../../../types/error-response-schema'
import { BadRequestError } from '../_errors/bad-request-error'

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
                discount_payment_before_due_date
            } = request.body

            const userId = await request.getCurrentUserId()
            const { member } = await request.getUserMember(company_id)

            const { cannot } = getUserPermissions(userId, member.role)

            if (cannot('create', 'Registration')) {
                throw new ForbiddenError()
            }

            const companyConfig = await prisma.configs.findUnique({
                where: { company_id }
            })

            // Calcular end_date baseado na start_date + meses da configuração da empresa
            let endDate = new Date();
            if (companyConfig?.registration_time) {
                const startDateObj = new Date(start_date);
                endDate = new Date(startDateObj);
                endDate.setMonth(endDate.getMonth() + companyConfig.registration_time);


                await prisma.$transaction(async (trx) => {
                    const registration = await trx.registrations.create({
                        data: {
                            company_id,
                            user_id,
                            start_date: new Date(start_date),
                            end_date: endDate,
                            monthly_fee_amount,
                            created_by: userId,
                            discount_payment_before_due_date,
                            updated_by: userId,
                        }
                    })

                    for (let i = 0; i < (companyConfig?.registration_time); i++) {
                        const dueDate = new Date(start_date);
                        dueDate.setMonth(dueDate.getMonth() + i);
                        dueDate.setDate(9);

                        await trx.monthly_fees.create({
                            data: {
                                registration_id: registration.id,
                                due_date: dueDate,
                                value: monthly_fee_amount,
                                discount_payment_before_due_date,
                                created_by: userId,
                                updated_by: userId,
                            }
                        })
                    }
                })
            } else {
                throw new BadRequestError('Configuração de tempo de inscrição não encontrada para a empresa.')
            }

            return reply.status(201).send({
                message: 'Inscrição criada com sucesso!'
            })
        })
}