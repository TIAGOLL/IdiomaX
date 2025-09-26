import 'fastify'
import type { members, companies } from '@prisma/client'

declare module 'fastify' {
    export interface FastifyRequest {
        getCurrentUserId(): Promise<string>,
        getUserMember(
            companyId: string,
        ): Promise<{ company: companies; member: members }>
    }
}