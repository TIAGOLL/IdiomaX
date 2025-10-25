import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { getRegistrationById } from '@/services/registrations/get-registration-by-id';
import { Badge } from '@/components/ui/badge';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { EditRegistrationForm } from './components/edit-registration-form';
import { MonthlyFeesTable } from './components/monthly-fees-table';
import { ToggleLockRegistrationForm } from './components/toggle-lock-registration-form';
import { Separator } from '@/components/ui/separator';
import { DeleteRegistrationForm } from './components/delete-registration-form';

export function RegistrationsEditPage({ registrationId }: { registrationId: string }) {
    const [, setSearchParams] = useSearchParams();

    // Buscar dados da matrícula
    const { data: registration, isLoading, error } = useQuery({
        queryKey: ['registration', registrationId],
        queryFn: () => getRegistrationById({
            registration_id: registrationId,
            company_id: getCurrentCompanyId()
        }),
        enabled: !!registrationId
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando dados da matrícula...</span>
                </div>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Erro ao carregar dados da matrícula</p>
                    <Button variant="outline" onClick={() => setSearchParams({ tab: 'list' })}>
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
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchParams({ tab: 'list' })}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <CardTitle className="flex gap-2">
                            <Users className="size-5" />
                            Editar Matrícula
                            <Badge variant={registration.active ? 'default' : 'destructive'}>
                                {registration.active ? 'Ativa' : 'Inativa'}
                            </Badge>
                        </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">
                        Edite a matrícula do estudante: {registration.user.name}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditRegistrationForm registration={registration} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar com informações adicionais */}
                <div className="space-y-4">
                    {/* Status do curso */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status da Matrícula</CardTitle>
                            <CardDescription>
                                Informações sobre o estado atual da matrícula.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={registration.active ? 'default' : 'destructive'}>
                                        {registration.active ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Criado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(registration.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Atualizado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(registration.updated_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ações da matrícula */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações da matrícula</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Ativar/Desativar Matrícula */}
                            <ToggleLockRegistrationForm registration={registration} />
                            <Separator />
                            {/* Excluir Matrícula */}
                            <DeleteRegistrationForm registration={registration} />
                        </CardContent>
                    </Card>
                </div>

                {/* Tabela de Mensalidades */}
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mensalidades</CardTitle>
                            <CardDescription>
                                Histórico e status das mensalidades da matrícula
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MonthlyFeesTable registration={registration} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}