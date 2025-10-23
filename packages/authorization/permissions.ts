import { AbilityBuilder } from '@casl/ability'

import { type AppAbility, type Role, type User } from '.'

type PermissionsByRole = (
    user: User,
    builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
    /**
     * ADMIN - Administrador da empresa
     * Pode gerenciar tudo na sua empresa
     */
    ADMIN(user, { can, }) {
        // Permissão total para tudo na aplicação
        can('manage', 'all')
    },

    /**
     * TEACHER - Professor da escola
     * Pode gerenciar suas turmas, alunos, tarefas e presenças
     */
    TEACHER(user, { can }) {
        // === GESTÃO DE USUÁRIOS ===
        can('get', 'User') // Ver perfis de alunos
        can('update', 'User') // Editar perfis (limitado no frontend)

        // === GESTÃO DE EMPRESA ===
        can('get', 'Company') // Ver dados da empresa
        can('get', 'Member') // Ver membros da empresa

        // === GESTÃO ACADÊMICA ===
        can(['get', 'create', 'update', 'delete'], 'Course') // Gerenciar cursos
        can(['get', 'create', 'update', 'delete'], 'Level') // Gerenciar níveis
        can(['get', 'create', 'update', 'delete'], 'Discipline') // Gerenciar disciplinas

        // === GESTÃO DE TURMAS ===
        can(['get', 'create', 'update', 'delete'], 'Classroom') // Gerenciar salas
        can(['get', 'create', 'update', 'delete'], 'Class') // Gerenciar turmas
        can(['get', 'create', 'update', 'delete'], 'Lesson') // Gerenciar aulas

        // === GESTÃO DE MATRÍCULAS ===
        can(['get', 'create', 'update'], 'Registration') // Matricular e gerenciar alunos

        // === GESTÃO FINANCEIRA ===
        can(['get', 'update'], 'MonthlyFee') // Ver e marcar mensalidades como pagas

        // === GESTÃO DE TAREFAS ===
        can(['get', 'create', 'update', 'delete', 'grade'], 'Task') // Gerenciar e corrigir tarefas

        // === GESTÃO DE MATERIAIS ===
        can(['get', 'create', 'update', 'delete'], 'Material') // Gerenciar materiais didáticos

        // === CONTROLE DE PRESENÇA ===
        can(['get', 'create', 'update', 'delete', 'mark'], 'Presence') // Controlar presença

        // === NOTIFICAÇÕES ===
        can(['get', 'send', 'receive'], 'Notification') // Gerenciar notificações
    },

    /**
     * STUDENT - Aluno da escola
     * Pode ver seus dados, tarefas, materiais e controlar sua assinatura
     */
    STUDENT(user, { can }) {
        // === GESTÃO PESSOAL ===
        can('get', 'User') // Ver seu próprio perfil
        can('update', 'User') // Atualizar seus dados (limitado no frontend)

        // === VISUALIZAÇÃO DA EMPRESA ===
        can('get', 'Company') // Ver dados da escola
        can('get', 'Member') // Ver professores e staff

        // === VISUALIZAÇÃO ACADÊMICA ===
        can('get', 'Course') // Ver cursos disponíveis
        can('get', 'Level') // Ver níveis
        can('get', 'Discipline') // Ver disciplinas
        can('get', 'Classroom') // Ver salas de aula
        can('get', 'Class') // Ver suas turmas

        // === GESTÃO DE MATRÍCULA ===
        can(['get', 'create'], 'Registration') // Ver suas matrículas e se matricular

        // === GESTÃO FINANCEIRA ===
        can(['get', 'pay'], 'MonthlyFee') // Ver e pagar suas mensalidades
        can('manage', 'Billing') // Gerenciar assinatura e pagamentos Stripe

        // === TAREFAS ===
        can(['get', 'submit'], 'Task') // Ver e entregar tarefas

        // === MATERIAIS DIDÁTICOS ===
        can('get', 'Material') // Acessar materiais das suas turmas

        // === PRESENÇA ===
        can('get', 'Presence') // Ver sua frequência

        // === RELATÓRIOS ===
        can('get', 'Report') // Ver seus relatórios de notas/frequência

        // === NOTIFICAÇÕES ===
        can(['get', 'receive'], 'Notification') // Receber notificações
    },
}