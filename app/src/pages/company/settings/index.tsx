import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionContext } from '@/contexts/session-context';
import { UpdateRegistrationTimeForm } from './components/update-registration-time-form';
import { CreateClassroomForm } from './components/create-classroom-form';
import { ClassroomsList } from './components/classrooms-list';
import { useQuery } from '@tanstack/react-query';
import { GetCompanySettings } from '@/services/settings/get-company-settings';
import { MapPinHouse } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getCurrentCompanyId } from '@/lib/company-utils';

export function MyCompanySettingsPage() {

    const { currentCompanyMember } = useSessionContext();

    const { data } = useQuery({
        queryKey: ['company-settings', currentCompanyMember?.company.id],
        queryFn: () => GetCompanySettings({
            company_id: getCurrentCompanyId()
        }),
        enabled: !!currentCompanyMember?.company.id,
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className='flex justify-between flex-row'>
                <CardHeader className='w-full'>
                    <CardTitle className="flex gap-2">
                        Editar Configurações da Empresa
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Edite as informações da empresa: {currentCompanyMember?.company.name}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPinHouse className='size-5' />
                                Cadastrar Sala de Aula
                            </CardTitle>
                            <CardDescription>
                                Preencha os dados para cadastrar uma nova sala de aula
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CreateClassroomForm />
                            <br />
                            <Separator />
                            <br />
                            <ClassroomsList />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {/* Lista de Salas de Aula */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tempo de matrícula</CardTitle>
                            <CardDescription>
                                O tempo de matrículas define por quanto tempo um estudante irá permanecer ativo em um curso.<br />
                                Essa configuração está diretamente ligada com a geração de mensalidades.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateRegistrationTimeForm currentValue={data?.registration_time} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle></CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}