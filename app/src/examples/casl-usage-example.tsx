// EXEMPLOS DE USO DO CASL NO FRONTEND

import { Can } from '@/lib/Can';
import { Button } from '@/components/ui/button';

/**
 * EXEMPLO 1: Mostrar botão apenas se usuário pode criar curso
 */
export function CourseCreateButton() {
    return (
        <Can I="create" a="Course">
            <Button>Criar Curso</Button>
        </Can>
    );
}

/**
 * EXEMPLO 2: Mostrar seção inteira apenas para quem pode gerenciar
 */
export function AdminSection() {
    return (
        <Can I="manage" a="all">
            <div className="admin-panel">
                <h2>Painel Administrativo</h2>
                <p>Apenas administradores veem isso</p>
            </div>
        </Can>
    );
}

/**
 * EXEMPLO 3: Mostrar diferentes ações baseadas em permissões
 */
export function StudentActions() {
    return (
        <div className="space-y-2">
            {/* Botão de editar - apenas para ADMIN e TEACHER */}
            <Can I="update" a="User">
                <Button variant="outline">Editar Aluno</Button>
            </Can>

            {/* Botão de deletar - apenas para ADMIN */}
            <Can I="delete" a="User">
                <Button variant="destructive">Deletar Aluno</Button>
            </Can>

            {/* Todos podem ver */}
            <Can I="get" a="User">
                <Button variant="secondary">Ver Detalhes</Button>
            </Can>
        </div>
    );
}

/**
 * EXEMPLO 4: Usar passThrough para renderizar independente da permissão
 * mas acessar informação de permissão via children function
 */
export function ConditionalButton() {
    return (
        <Can I="create" a="Lesson" passThrough>
            {(allowed) => (
                <Button disabled={!allowed}>
                    {allowed ? 'Criar Aula' : 'Sem Permissão'}
                </Button>
            )}
        </Can>
    );
}

/**
 * EXEMPLO 5: Usar com hook useAbility diretamente
 */
import { useContext } from 'react';
import { AbilityContext } from '@/lib/Can';

export function UseAbilityExample() {
    const ability = useContext(AbilityContext);

    // Verificar permissão programaticamente
    const canCreateCourse = ability.can('create', 'Course');
    const canManageAll = ability.can('manage', 'all');

    return (
        <div>
            <p>Pode criar curso: {canCreateCourse ? 'Sim' : 'Não'}</p>
            <p>É admin: {canManageAll ? 'Sim' : 'Não'}</p>
        </div>
    );
}

/**
 * EXEMPLO 6: Múltiplas ações combinadas
 */
export function LessonManagement() {
    return (
        <div className="space-y-4">
            {/* TEACHER e ADMIN podem gerenciar aulas */}
            <Can I="manage" a="Lesson">
                <div className="lesson-controls">
                    <Button>Criar Aula</Button>
                    <Button variant="outline">Editar Aula</Button>
                    <Button variant="destructive">Deletar Aula</Button>
                </div>
            </Can>

            {/* STUDENT pode apenas ver */}
            <Can I="get" a="Lesson">
                <div className="lesson-view">
                    <h3>Minhas Aulas</h3>
                    {/* Lista de aulas */}
                </div>
            </Can>
        </div>
    );
}

/**
 * EXEMPLO 7: Controle de navegação
 */
export function NavigationMenu() {
    return (
        <nav>
            {/* Apenas ADMIN vê */}
            <Can I="manage" a="all">
                <a href="/admin/dashboard">Dashboard Admin</a>
            </Can>

            {/* TEACHER e ADMIN veem */}
            <Can I="manage" a="Lesson">
                <a href="/lessons">Gerenciar Aulas</a>
            </Can>

            {/* Todos podem ver suas próprias informações */}
            <Can I="get" a="User">
                <a href="/profile">Meu Perfil</a>
            </Can>
        </nav>
    );
}

/**
 * PERMISSÕES DISPONÍVEIS POR ROLE:
 * 
 * ADMIN:
 * - can('manage', 'all') - Pode fazer tudo
 * 
 * TEACHER:
 * - can(['get', 'create', 'update', 'delete'], 'Course')
 * - can(['get', 'create', 'update', 'delete'], 'Level')
 * - can(['get', 'create', 'update', 'delete'], 'Discipline')
 * - can(['get', 'create', 'update', 'delete'], 'Classroom')
 * - can(['get', 'create', 'update', 'delete'], 'Class')
 * - can(['get', 'create', 'update', 'delete'], 'Lesson')
 * - can(['get', 'create', 'update'], 'Registration')
 * - can(['get', 'update'], 'MonthlyFee')
 * - can(['get', 'create', 'update', 'delete', 'grade'], 'Task')
 * - can(['get', 'create', 'update', 'delete'], 'Material')
 * - can(['get', 'create', 'update', 'delete', 'mark'], 'Presence')
 * - can('get', 'User')
 * - can('update', 'User')
 * - can('get', 'Company')
 * - can('get', 'Member')
 * - can(['get', 'send', 'receive'], 'Notification')
 * 
 * STUDENT:
 * - can('get', 'User')
 * - can('update', 'User')
 * - can('get', 'Company')
 * - can('get', 'Member')
 * - can('get', 'Course')
 * - can('get', 'Level')
 * - can('get', 'Discipline')
 * - can('get', 'Classroom')
 * - can('get', 'Class')
 * - can(['get', 'create'], 'Registration')
 * - can(['get', 'pay'], 'MonthlyFee')
 * - can('manage', 'Billing')
 * - can(['get', 'submit'], 'Task')
 * - can('get', 'Material')
 * - can('get', 'Presence')
 * - can('get', 'Report')
 * - can(['get', 'receive'], 'Notification')
 */
