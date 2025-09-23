import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { UpdateLevelApiRequestSchema, UpdateLevelApiResponseSchema } from '@idiomax/http-schemas/levels/update-level'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../middlewares/auth'
import { checkMemberAccess } from '../../../lib/permissions'
import { BadRequestError } from '../_errors/bad-request-error'
import { z } from 'zod'

const ErrorResponseSchema = z.object({
    message: z.string()
})

export async function updateLevel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .put('/level/:id', {
            schema: {
                tags: ['Levels'],
                summary: 'Update level',
                security: [{ bearerAuth: [] }],
                body: UpdateLevelApiRequestSchema,
                response: {
                    200: UpdateLevelApiResponseSchema,
                    400: ErrorResponseSchema,
                    403: ErrorResponseSchema,
                    404: ErrorResponseSchema
                },
            },
        }, async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const { id } = request.params as { id: string }
            const {
                company_id,
                name,
                level,
                active,
                disciplines
            } = request.body

            const { company } = await checkMemberAccess(company_id, userId)

            // Verificar se o level existe
            const existingLevel = await prisma.levels.findFirst({
                where: {
                    id,
                    active: true
                },
                include: {
                    courses: true
                }
            })

            if (!existingLevel) {
                throw new BadRequestError('Level não encontrado.')
            }

            // Verificar se o level pertence à empresa
            if (existingLevel.courses?.companies_id !== company.id) {
                throw new BadRequestError('Level não pertence a esta empresa.')
            }

            // Verificar se já existe outro level com o mesmo número no curso (exceto o atual)
            if (level !== Number(existingLevel.level)) {
                const conflictingLevel = await prisma.levels.findFirst({
                    where: {
                        level,
                        courses_id: existingLevel.courses_id,
                        active: true,
                        NOT: {
                            id: id
                        }
                    }
                })

                if (conflictingLevel) {
                    throw new BadRequestError('Já existe outro level com este número neste curso.')
                }
            }

            // Verificar se já existe outro level com o mesmo nome no curso (exceto o atual)
            if (name !== existingLevel.name) {
                const conflictingLevelName = await prisma.levels.findFirst({
                    where: {
                        name,
                        courses_id: existingLevel.courses_id,
                        active: true,
                        NOT: {
                            id: id
                        }
                    }
                })

                if (conflictingLevelName) {
                    throw new BadRequestError('Já existe outro level com este nome neste curso.')
                }
            }

            // Atualizar level e disciplinas em uma transação
            const updatedLevel = await prisma.$transaction(async (prisma) => {
                // Atualizar o level
                await prisma.levels.update({
                    where: { id },
                    data: {
                        name,
                        level,
                        active,
                        updated_by: userId,
                        updated_at: new Date(),
                    }
                })

                // Gerenciar disciplinas
                for (const discipline of disciplines) {
                    if (discipline.id) {
                        // Atualizar disciplina existente
                        await prisma.disciplines.update({
                            where: { id: discipline.id },
                            data: {
                                name: discipline.name,
                                active: discipline.active ?? true,
                                updated_by: userId,
                                updated_at: new Date(),
                            }
                        })
                    } else {
                        // Criar nova disciplina
                        await prisma.disciplines.create({
                            data: {
                                name: discipline.name,
                                levels_id: id,
                                created_by: userId,
                                updated_by: userId,
                            }
                        })
                    }
                }

                // Buscar o level atualizado com disciplinas
                return await prisma.levels.findFirst({
                    where: { id },
                    include: {
                        disciplines: {
                            where: {
                                active: true
                            },
                            orderBy: {
                                created_at: 'asc'
                            }
                        }
                    }
                })
            })

            if (!updatedLevel) {
                throw new BadRequestError('Erro ao atualizar level.')
            }

            const mappedLevel = {
                id: updatedLevel.id,
                name: updatedLevel.name,
                level: Number(updatedLevel.level),
                courses_id: updatedLevel.courses_id || '',
                created_at: updatedLevel.created_at.toISOString(),
                updated_at: updatedLevel.updated_at.toISOString(),
                active: updatedLevel.active,
                disciplines: updatedLevel.disciplines.map(discipline => ({
                    id: discipline.id,
                    name: discipline.name,
                    levels_id: discipline.levels_id,
                    created_at: discipline.created_at.toISOString(),
                    updated_at: discipline.updated_at.toISOString(),
                    active: discipline.active
                }))
            }

            return reply.status(200).send({
                message: 'Level atualizado com sucesso!',
                level: mappedLevel
            })
        })
}