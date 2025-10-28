import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskFormSchema } from '@idiomax/validation-schemas/tasks/create-task';
import type { z } from 'zod';
import { createTask } from '@/services/tasks/create-task';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { ArrowLeft, Save, LoaderIcon } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getClassById } from '@/services/class/get-class-by-id';
import { getLevelsByCourse } from '@/services/levels';
import { getCurrentCompanyId } from '@/lib/company-utils';

type CreateTaskFormData = z.input<typeof CreateTaskFormSchema>;

export function CreateTaskPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const classId = searchParams.get('id');

    // Buscar dados da turma
    const { data: classData } = useQuery({
        queryKey: ['class', classId],
        queryFn: () => getClassById({
            class_id: classId!,
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!classId,
    });

    // Buscar níveis e disciplinas do curso da turma
    const { data: levels } = useQuery({
        queryKey: ['levels', classData?.course_id],
        queryFn: () => getLevelsByCourse({
            course_id: classData!.course_id,
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!classData?.course_id,
    });

    // Flatten disciplines from all levels
    const disciplines = levels?.flatMap(level =>
        level.disciplines?.map(d => ({
            ...d,
            levelName: level.name
        })) || []
    ) || [];

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateTaskFormData) => {
            const response = await createTask({
                ...data,
                value: Number(data.value),
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
            setSearchParams({ tab: 'list' });
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreateTaskFormData>({
        resolver: zodResolver(CreateTaskFormSchema),
        defaultValues: {
            discipline_id: '',
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchParams({ tab: 'list' })}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nova Tarefa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="discipline_id">Disciplina *</Label>
                            <Controller
                                name="discipline_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={disciplines.length === 0}
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
                                )}
                            />
                            {errors.discipline_id && (
                                <p className="text-sm text-destructive">{errors.discipline_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Nome da tarefa"
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
                                onClick={() => setSearchParams({ tab: 'list' })}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && "Criando..."}
                                {!isPending && "Criar Tarefa"}
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
