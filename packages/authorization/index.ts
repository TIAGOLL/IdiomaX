// Imports da biblioteca CASL para controle de acesso baseado em habilidades
import {
    AbilityBuilder,
    type CreateAbility,
    createMongoAbility,
    type MongoAbility,
} from '@casl/ability'
// Zod para validação de schemas
import { z } from 'zod'

// Modelo de usuário para definição de permissões
import { type User } from './models/user'
// Configurações de permissões por role
import { permissions } from './permissions'

// Importação de todos os subjects (entidades) do sistema
// Cada subject define as ações possíveis para uma entidade específica
import { userSubject } from './subjects/user'
import { companySubject } from './subjects/company'
import { memberSubject } from './subjects/member'
import { courseSubject } from './subjects/course'
import { levelSubject } from './subjects/level'
import { disciplineSubject } from './subjects/discipline'
import { classroomSubject } from './subjects/classroom'
import { classSubject } from './subjects/class'
import { registrationSubject } from './subjects/registration'
import { monthlyFeeSubject } from './subjects/monthly-fee'
import { taskSubject } from './subjects/task'
import { materialSubject } from './subjects/material'
import { presenceSubject } from './subjects/presence'
import { billingSubject } from './subjects/billing'
import { reportSubject } from './subjects/report'
import { notificationSubject } from './subjects/notification'
import { roleSubject } from './subjects/role'
import { lessonSubject } from './subjects/lesson'

// Exporta modelos e roles
export * from './models/user'
export * from './models/company'
export * from './roles'

/**
 * Schema que define todas as habilidades (permissions) possíveis no sistema
 * Combina todos os subjects (entidades) em uma union type
 * Cada subject define tuplas [ação, entidade] como ['get', 'User'] ou ['create', 'Course']
 */
const appAbilitiesSchema = z.union([
    userSubject,
    companySubject,
    memberSubject,
    courseSubject,
    levelSubject,
    disciplineSubject,
    classroomSubject,
    lessonSubject,
    roleSubject,
    classSubject,
    registrationSubject,
    monthlyFeeSubject,
    taskSubject,
    materialSubject,
    presenceSubject,
    billingSubject,
    reportSubject,
    notificationSubject,
    z.tuple([z.literal('manage'), z.literal('all')]),
])

// Inferir o tipo TypeScript do schema Zod
type AppAbilities = z.infer<typeof appAbilitiesSchema>

// Tipos exportados para uso em outras partes da aplicação
export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>
/**
 * Função principal que define as habilidades de um usuário baseadas em sua role
 * @param user - Usuário para o qual as permissões serão definidas
 * @returns Objeto de habilidades (ability) configurado para o usuário
 */

export function defineAbilityFor(user: User) {
    const builder = new AbilityBuilder(createAppAbility)

    if (typeof permissions[user.role] !== 'function') {
        throw new Error(`Permissions for role ${user.role} not found.`)
    }

    permissions[user.role](user, builder)

    const ability = builder.build({
        detectSubjectType(subject) {
            return subject.__typename
        },
    })

    ability.can = ability.can.bind(ability)
    ability.cannot = ability.cannot.bind(ability)

    return ability
}


