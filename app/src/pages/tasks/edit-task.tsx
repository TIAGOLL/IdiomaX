import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateTaskFormSchema } from '@idiomax/validation-schemas/tasks/update-task';
import type { z } from 'zod';
import { updateTask } from '@/services/tasks/update-task';
import { getTaskById } from '@/services/tasks/get-task-by-id';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { ArrowLeft, Save, LoaderIcon } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

type UpdateTaskFormData = z.input<typeof UpdateTaskFormSchema>;

interface EditTaskPageProps {
    taskId: string;
}

export function EditTaskPage({ taskId }: EditTaskPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const disciplineId = searchParams.get('discipline') || '';

    const { data: task, isPending: isLoadingTask } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
        enabled: !!taskId,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateTaskFormData) => {
            const response = await updateTask(taskId, {
                ...data,
                value: Number(data.value),
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            setSearchParams({ tab: 'list', discipline: disciplineId });
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateTaskFormData>({
        resolver: zodResolver(UpdateTaskFormSchema),
        values: task ? {
            title: task.title,
            description: task.description || '',
            value: task.value,
            submit_date: new Date(task.submit_date).toISOString().substring(0, 16), // YYYY-MM-DDTHH:mm
            discipline_id: task.discipline_id,
        } : undefined,
    });

    if (isLoadingTask) {
        return <Skeleton className="h-96 w-full" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchParams({ tab: 'list', discipline: disciplineId })}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Editar Tarefa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                        <input type="hidden" {...register('discipline_id')} />

                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Nome da tarefa"
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Descreva a tarefa..."
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="value">Valor (pontos) *</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    step="0.1"
                                    {...register('value')}
                                    placeholder="10"
                                />
                                {errors.value && (
                                    <p className="text-sm text-destructive">{errors.value.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="submit_date">Data e Horário de Entrega *</Label>
                                <Input
                                    id="submit_date"
                                    type="datetime-local"
                                    {...register('submit_date')}
                                />
                                {errors.submit_date && (
                                    <p className="text-sm text-destructive">{errors.submit_date.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSearchParams({ tab: 'list', discipline: disciplineId })}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && "Salvando..."}
                                {!isPending && "Salvar Alterações"}
                                {isPending && <LoaderIcon className="w-4 h-4 ml-2 animate-spin" />}
                                {!isPending && <Save className="ml-2" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
