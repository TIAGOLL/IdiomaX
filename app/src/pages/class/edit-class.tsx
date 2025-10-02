import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Loader2, X } from 'lucide-react';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { getClassById } from '@/services/class/get-class-by-id';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router';
import { EditClassForm } from './components/edit-class-form';
import { DeleteClassForm } from './components/delete-class-form';
import { ManageUsersInClass } from './components/manage-users-in-class';
import { AddUserInClassForm } from './components/add-user-in-class';

export function EditClassPage({ classId }: { classId: string }) {
    const [, setSearchParams] = useSearchParams()

    const { data, isLoading, error } = useQuery({
        queryKey: ['class', classId],
        queryFn: () => getClassById({ class_id: classId, company_id: getCurrentCompanyId() }),
        enabled: !!classId
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando dados da turma...</span>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Erro ao carregar dados da turma</p>
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
                        <BookOpen className="size-5" />
                        Editar Turma
                        <Badge variant={data.active ? 'default' : 'destructive'}>
                            {data.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Edite as informações do curso: {data.name}
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
                            <CardTitle>Informações da turma</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditClassForm class={data} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar com informações adicionais */}
                <div className="space-y-4">
                    {/* Status da turma */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status da Turma</CardTitle>
                            <CardDescription>
                                Informações sobre o estado atual da turma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={data.active ? 'default' : 'destructive'}>
                                        {data.active ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Criado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(data.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Atualizado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(data.updated_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ações da Turma */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações da Turma</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Excluir Turma */}
                            <DeleteClassForm class={data} />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col items-start gap-2'>
                                    <CardTitle className='flex flex-row items-center gap-2'>
                                        <GraduationCap className="size-5" />
                                        Alunos e professores
                                    </CardTitle>
                                    <CardDescription>
                                        Gerencie os alunos e professores da turma: {data.name}
                                    </CardDescription>
                                </div>
                                <div>
                                    <AddUserInClassForm classId={data.id} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ManageUsersInClass usersInClass={data.users_in_class} classId={data.id} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
