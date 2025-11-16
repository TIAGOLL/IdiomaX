import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Save } from 'lucide-react';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { getClassGrades } from '@/services/grades/get-class-grades';
import { updateGrade } from '@/services/grades/update-grade';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Can } from '@/lib/Can';

export function ClassGradesPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('class_id');
    const [editingGrades, setEditingGrades] = useState<Record<string, number>>({});

    const { data, isPending, error } = useQuery({
        queryKey: ['class-grades', classId],
        queryFn: () => getClassGrades({
            class_id: classId!,
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!classId && !!getCurrentCompanyId(),
    });

    const updateGradeMutation = useMutation({
        mutationFn: updateGrade,
        onSuccess: () => {
            toast.success('Nota atualizada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['class-grades', classId] });
        },
        onError: () => {
            toast.error('Erro ao atualizar nota');
        },
    });

    const handleGradeChange = (submissionId: string, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setEditingGrades(prev => ({ ...prev, [submissionId]: numValue }));
        }
    };

    const handleSaveGrade = async (submissionId: string) => {
        const grade = editingGrades[submissionId];
        if (grade !== undefined) {
            await updateGradeMutation.mutateAsync({
                submission_id: submissionId,
                grade: grade,
                company_id: getCurrentCompanyId(),
            });
            setEditingGrades(prev => {
                const newState = { ...prev };
                delete newState[submissionId];
                return newState;
            });
        }
    };

    if (!classId) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        ID da turma não fornecido.
                    </div>
                </CardContent>
            </Card>
        );
    }

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
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="size-5" />
                                        Notas - {data?.class.name}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/admin/classes')}
                                    >
                                        <ArrowLeft className="size-4 mr-2" />
                                        Voltar
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Curso: {data?.class.course_name}
                                </p>
                            </CardHeader>
                        </Card>

                        {/* Tabela de alunos */}
                        {data?.students.map((student) => (
                            <Card key={student.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <div>
                                            <span>{student.name}</span>
                                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                                ({student.email})
                                            </span>
                                        </div>
                                        <div className="flex gap-4 text-sm font-normal">
                                            <span>Média: <strong>{student.average}</strong></span>
                                            <span>
                                                Tarefas: <strong>{student.completed_tasks}/{student.total_tasks}</strong>
                                            </span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
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
                                                    <TableHead className="w-[100px]">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {student.grades.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                            Nenhuma tarefa encontrada.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    student.grades.map((grade) => (
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
                                                                {grade.submission_id ? (
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        className="w-20"
                                                                        defaultValue={grade.grade ?? ''}
                                                                        placeholder="Nota"
                                                                        onChange={(e) =>
                                                                            handleGradeChange(
                                                                                grade.submission_id!,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <span className="text-muted-foreground">Não entregue</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {grade.submission_id &&
                                                                    editingGrades[grade.submission_id] !== undefined && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleSaveGrade(
                                                                                    grade.submission_id!
                                                                                )
                                                                            }
                                                                            disabled={updateGradeMutation.isPending}
                                                                        >
                                                                            <Save className="size-4" />
                                                                        </Button>
                                                                    )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {data?.students.length === 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center text-muted-foreground">
                                        Nenhum aluno matriculado nesta turma.
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
