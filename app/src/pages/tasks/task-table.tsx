import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, X, Edit, Plus, Trash2, ClipboardList } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { formatDate } from '@/lib/utils';
import { getTasks } from '@/services/tasks/get-tasks';
import { useSearchParams } from 'react-router';
import { Can } from '@/lib/Can';
import { toast } from 'sonner';
import { deleteTask } from '@/services/tasks/delete-task';
import { getCourses } from '@/services/courses';
import { getLevelsByCourse } from '@/services/levels';
import { getCurrentCompanyId } from '@/lib/company-utils';

export function TasksTablePage() {
    const [, setSearchParams] = useSearchParams();
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('');

    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourses({ company_id: getCurrentCompanyId() }),
    });

    const { data: levels } = useQuery({
        queryKey: ['levels', selectedCourseId],
        queryFn: () => getLevelsByCourse({
            course_id: selectedCourseId,
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!selectedCourseId,
    });

    // Flatten disciplines from all levels
    const disciplines = levels?.flatMap(level =>
        level.disciplines?.map(d => ({
            ...d,
            levelName: level.name
        })) || []
    ) || [];

    const { data, isPending, error, refetch } = useQuery({
        queryKey: ['tasks', selectedDisciplineId],
        queryFn: () => getTasks({ discipline_id: selectedDisciplineId }),
        enabled: !!selectedDisciplineId,
    });

    // Filtrar dados baseado na busca
    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter((task) => {
            const matchesSearch = !searchFilter ||
                task.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchFilter.toLowerCase());

            return matchesSearch;
        });
    }, [data, searchFilter]);

    const handleEdit = (taskId: string) => {
        setSearchParams({ tab: 'edit', id: taskId });
    };

    const handleDelete = async (taskId: string, taskTitle: string) => {
        if (confirm(`Tem certeza que deseja deletar a tarefa "${taskTitle}"?`)) {
            try {
                await deleteTask(taskId);
                toast.success('Tarefa deletada com sucesso');
                refetch();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar tarefa';
                toast.error(errorMessage);
            }
        }
    };

    const clearFilters = () => {
        setSearchFilter('');
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
                        Erro ao carregar tarefas. Tente novamente.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disciplina</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-semibold">{data?.[0]?.discipline?.name || '-'}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros e Ações */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Tarefas da Disciplina</CardTitle>
                        <Can I="create" a="Task">
                            <Button onClick={() => setSearchParams({ tab: 'create' })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Tarefa
                            </Button>
                        </Can>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filtros */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Curso</label>
                                <Select
                                    value={selectedCourseId}
                                    onValueChange={(value) => {
                                        setSelectedCourseId(value);
                                        setSelectedDisciplineId('');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um curso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses?.map((course) => (
                                            <SelectItem key={course.id} value={course.id}>
                                                {course.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Disciplina</label>
                                <Select
                                    value={selectedDisciplineId}
                                    onValueChange={setSelectedDisciplineId}
                                    disabled={!selectedCourseId || disciplines.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma disciplina" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disciplines.map((discipline) => (
                                            <SelectItem key={discipline.id} value={discipline.id}>
                                                {discipline.name} ({discipline.levelName})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por título ou descrição..."
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    className="pl-10"
                                    disabled={!selectedDisciplineId}
                                />
                            </div>

                            {searchFilter && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="mr-2 h-4 w-4" />
                                    Limpar
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tabela */}
                    {!selectedDisciplineId ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ClipboardList className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Selecione uma disciplina</p>
                            <p className="text-sm">Escolha um curso e uma disciplina para ver as tarefas</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ClipboardList className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
                            <p className="text-sm">
                                {searchFilter ? 'Tente ajustar os filtros' : 'Crie sua primeira tarefa'}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Data de Entrega</TableHead>
                                        <TableHead>Criado em</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium">{task.title}</TableCell>
                                            <TableCell className="max-w-md truncate">
                                                {task.description || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{task.value} pts</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(task.submit_date).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(task.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <DotsHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <Can I="update" a="Task">
                                                            <DropdownMenuItem onClick={() => handleEdit(task.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                        </Can>
                                                        <Can I="delete" a="Task">
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(task.id, task.title)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Deletar
                                                            </DropdownMenuItem>
                                                        </Can>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
