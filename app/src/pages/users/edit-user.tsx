import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Users, Loader2, } from 'lucide-react';
import { useSessionContext } from '@/contexts/session-context';
import { AddRoleForm } from './components/add-role-form';
import { DeactivateUserForm } from './components/deactivate-user-form';
import { DeleteUserForm } from './components/delete-user-form';
import { DeleteRoleForm } from './components/delete-role-form';
import { EditPasswordForm } from './components/edit-password-form';
import { EditUserForm } from './components/edit-user-form';
import { useSearchParams } from 'react-router';
import { getUserById } from '@/services/users/get-user-by-id';
import { Badge } from '@/components/ui/badge';

export function EditUserPage() {
    const { currentCompanyMember } = useSessionContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get('id') || '';

    // Buscar dados do usuário
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    });

    // Se está carregando ou há erro
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando dados do usuário...</span>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Erro ao carregar dados do usuário</p>
                    <Button variant="outline">
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className='flex justify-between flex-row pr-6'>
                <CardHeader className='w-full'>
                    <CardTitle className="flex gap-2">
                        Editar Usuário
                        <Badge variant={user.active ? 'default' : 'destructive'}>
                            {user.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Edite as informações do usuário: {user.name}
                    </CardDescription>
                </CardHeader>
                <Button variant="outline" size="sm" onClick={() => setSearchParams({ tab: 'list' })}>
                    <X className="h-4 w-4" />
                </Button>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditUserForm user={user} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {/* Alterar senha - apenas admin pode alterar senha de STUDENT e TEACHER */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Editar senha do usuário</CardTitle>
                            <CardDescription>
                                Apenas administradores podem alterar a senha de usuários.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditPasswordForm user={user} />
                        </CardContent>
                    </Card>

                    {/* Gerenciar Roles */}
                    {currentCompanyMember?.role === 'ADMIN' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Gerenciar Roles
                                </CardTitle>
                            </CardHeader>

                            {/* Roles atuais */}
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Roles Atuais:</Label>
                                        <div className="space-y-2">
                                            {user.member_on.map(member => (
                                                <div key={member.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                    {/* Excluir Role */}
                                                    <span>
                                                        {member.role === 'ADMIN' && '👑 Administrador'}
                                                        {member.role === 'TEACHER' && '👨‍🏫 Professor'}
                                                        {member.role === 'STUDENT' && '🎓 Estudante'}
                                                    </span>
                                                    {user.member_on.length > 1 && (
                                                        <DeleteRoleForm user={user} role={member.role} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Adicionar nova role */}
                                    <AddRoleForm user={user} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Ações de usuário */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações do Usuário</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Ativar/Desativar Usuário */}
                            <DeactivateUserForm user={user} />
                            <Separator />
                            {/* Excluir Usuário */}
                            <DeleteUserForm user={user} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}