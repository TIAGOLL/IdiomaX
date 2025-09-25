// Imports da biblioteca CASL para controle de acesso baseado em habilidades
import {
    AbilityBuilder,
    CreateAbility,
    createMongoAbility,
    MongoAbility,
} from '@casl/ability'
// Zod para validação de schemas
import { z } from 'zod'

// Modelo de usuário para definição de permissões
import { User } from './models/user'
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
import { calendarSubject } from './subjects/calendar'
import { reportSubject } from './subjects/report'
import { notificationSubject } from './subjects/notification'
import { eventSubject } from './subjects/event'

// Exporta todos os subjects para uso externo
export * from './subjects/user'
export * from './subjects/company'
export * from './subjects/member'
export * from './subjects/course'
export * from './subjects/level'
export * from './subjects/discipline'
export * from './subjects/classroom'
export * from './subjects/class'
export * from './subjects/registration'
export * from './subjects/monthly-fee'
export * from './subjects/task'
export * from './subjects/material'
export * from './subjects/presence'
export * from './subjects/billing'
export * from './subjects/calendar'
export * from './subjects/report'
export * from './subjects/notification'
export * from './subjects/event'
export * from './subjects/all'
// Exporta modelos e roles
export * from './models/user'
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
    classSubject,
    registrationSubject,
    monthlyFeeSubject,
    taskSubject,
    materialSubject,
    presenceSubject,
    billingSubject,
    calendarSubject,
    reportSubject,
    notificationSubject,
    eventSubject,
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
    // Builder para construir as habilidades do usuário
    const builder = new AbilityBuilder(createAppAbility)

    // Verifica se existem permissões definidas para a role do usuário
    if (typeof permissions[user.role] !== 'function') {
        throw new Error(`Permissões para a role ${user.role} não encontradas.`)
    }

    // Aplica as permissões específicas da role do usuário
    permissions[user.role](user, builder)

    // Constrói o objeto de habilidades final
    const ability = builder.build()

    // Vincula os métodos can/cannot ao contexto correto
    ability.can = ability.can.bind(ability)
    ability.cannot = ability.cannot.bind(ability)

    return ability
}