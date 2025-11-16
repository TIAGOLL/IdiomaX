import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChevronDown, BookOpen, Award, ArrowLeft, CheckCircle } from 'lucide-react';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { getStudentGrades } from '@/services/grades/get-student-grades';
import { submitTask } from '@/services/grades/submit-task';
import { formatDate } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { Can } from '@/lib/Can';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function StudentGradesPage() {
    const [openRegistrations, setOpenRegistrations] = useState<Record<string, boolean>>({});
    const [searchParams, setSearchParams] = useSearchParams();
    const classIdFilter = searchParams.get('class_id');
    const queryClient = useQueryClient();

    const { data, isPending, error } = useQuery({
        queryKey: ['student-grades'],
        queryFn: () => getStudentGrades({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    const submitTaskMutation = useMutation({
        mutationFn: submitTask,
        onSuccess: () => {
            toast.success('Tarefa marcada como entregue!');
            queryClient.invalidateQueries({ queryKey: ['student-grades'] });
        },
        onError: (error: Error) => {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao submeter tarefa';
            toast.error(errorMessage);
        },
    });

    const handleSubmitTask = (taskId: string, registrationId: string) => {
        submitTaskMutation.mutate({
            task_id: taskId,
            registration_id: registrationId,
            company_id: getCurrentCompanyId(),
        });
    };

    // Filtrar registros por class_id se fornecido
    const filteredRegistrations = useMemo(() => {
        if (!data?.registrations || !classIdFilter) {
            return data?.registrations || [];
        }

        return data.registrations.filter(registration =>
            registration.grades.some(grade => grade.class_id === classIdFilter)
        ).map(registration => ({
            ...registration,
            grades: registration.grades.filter(grade => grade.class_id === classIdFilter)
        }));
    }, [data?.registrations, classIdFilter]);

    const toggleRegistration = (registrationId: string) => {
        setOpenRegistrations(prev => ({
            ...prev,
            [registrationId]: !prev[registrationId]
        }));
    };

    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Erro ao carregar notas. Tente novamente.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Can I="get" a="Grade" passThrough>
            {(allowed) => {
                if (!allowed) {
                    return (
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center text-muted-foreground">
                                    Você não tem permissão para acessar esta página.
                                </div>
                            </CardContent>
                        </Card>
                    );
                }

                return (
                    <div className="container mx-auto p-6 space-y-6">
                        {/* Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchParams({ tab: 'list' })}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="size-5" />
                                            Minhas Notas
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Visualize suas notas e progresso em cada curso
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Matrículas */}
                        {filteredRegistrations.map((registration) => (
                            <Collapsible
                                key={registration.id}
                                open={openRegistrations[registration.id]}
                                onOpenChange={() => toggleRegistration(registration.id)}
                            >
                                <Card>
                                    <CollapsibleTrigger className="w-full">
                                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="size-5" />
                                                    <CardTitle className="text-lg">{registration.course_name}</CardTitle>
                                                    {registration.completed && (
                                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                                            Concluído
                                                        </span>
                                                    )}
                                                    {registration.locked && (
                                                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                                            Bloqueado
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-sm text-muted-foreground">
                                                        <span>Média: <strong className="text-foreground">{registration.average}</strong></span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <span>Tarefas: <strong className="text-foreground">{registration.completed_tasks}/{registration.total_tasks}</strong></span>
                                                    </div>
                                                    <ChevronDown
                                                        className={`size-5 transition-transform ${openRegistrations[registration.id] ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                                                <span>Início: {formatDate(registration.start_date)}</span>
                                                <span>Término: {formatDate(registration.end_date)}</span>
                                            </div>
                                        </CardHeader>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <CardContent className="p-0">
                                            <div className="max-h-96 overflow-y-auto">
                                                <Table>
                                                    <TableHeader className="border-b-1 border-b-white/50">
                                                        <TableRow>
                                                            <TableHead>Tarefa</TableHead>
                                                            <TableHead>Disciplina</TableHead>
                                                            <TableHead>Nível</TableHead>
                                                            <TableHead>Valor</TableHead>
                                                            <TableHead>Data Limite</TableHead>
                                                            <TableHead>Data Entrega</TableHead>
                                                            <TableHead>Nota</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="w-[150px]">Ações</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {registration.grades.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                                    Nenhuma tarefa encontrada.
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            registration.grades.map((grade) => (
                                                                <TableRow key={grade.task_id}>
                                                                    <TableCell className="font-medium">
                                                                        {grade.task_title}
                                                                    </TableCell>
                                                                    <TableCell>{grade.discipline_name}</TableCell>
                                                                    <TableCell>{grade.level_name}</TableCell>
                                                                    <TableCell>{grade.task_value}</TableCell>
                                                                    <TableCell>
                                                                        {formatDate(grade.submit_date)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {grade.submitted_at ? formatDate(grade.submitted_at) : '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {grade.grade !== null ? (
                                                                            <span className={`font-semibold ${grade.grade >= 70 ? 'text-green-500' : grade.grade >= 50 ? 'text-yellow-500' : 'text-red-500'
                                                                                }`}>
                                                                                {grade.grade}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-muted-foreground">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {!grade.submitted_at ? (
                                                                            <span className="text-yellow-500">Pendente</span>
                                                                        ) : grade.grade === null ? (
                                                                            <span className="text-blue-500">Aguardando correção</span>
                                                                        ) : (
                                                                            <span className="text-green-500">Corrigido</span>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {!grade.submitted_at ? (
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleSubmitTask(grade.task_id, registration.id)}
                                                                                disabled={submitTaskMutation.isPending}
                                                                            >
                                                                                <CheckCircle className="size-4 mr-2" />
                                                                                Marcar como entregue
                                                                            </Button>
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-sm">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}

                        {filteredRegistrations.length === 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center text-muted-foreground">
                                        {classIdFilter
                                            ? 'Nenhuma nota encontrada para esta turma.'
                                            : 'Você não possui matrículas ativas.'}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );
            }}
        </Can>
    );
}
