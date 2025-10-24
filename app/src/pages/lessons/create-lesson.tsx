import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, LoaderIcon, Save, ArrowLeft, Calendar } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLessonFormSchema } from '@idiomax/validation-schemas/lessons/create-lesson';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { createLesson } from '@/services/lessons/create-lesson';
import { getClass } from '@/services/class';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';

type CreateLessonRequest = z.infer<typeof CreateLessonFormSchema>;

export function CreateLessonPage() {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateLessonRequest) => {
            const response = await createLesson({
                company_id: getCurrentCompanyId(),
                theme: data.theme,
                start_date: data.start_date.toISOString(),
                end_date: data.end_date.toISOString(),
                class_id: data.class_id
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(`${res.message} Lista de presença gerada automaticamente!`);
            navigate('?tab=list');
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const { data: classes } = useQuery({
        queryKey: ['class'],
        queryFn: () => getClass({ company_id: getCurrentCompanyId() }),
        enabled: !!getCurrentCompanyId(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch
    } = useForm({
        resolver: zodResolver(CreateLessonFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            theme: '',
            class_id: '',
        }
    });

    const selectedClassId = watch('class_id');
    const selectedClass = classes?.find(c => c.id === selectedClassId);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('?tab=list')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <CardTitle className="flex gap-2 items-center">
                            <Calendar className="w-5 h-5" />
                            Criar Nova Aula
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Preencha os dados para criar uma nova aula. A lista de presença será gerada automaticamente com todos os alunos da turma selecionada.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-6">
                    <form onSubmit={handleSubmit((data) => mutate(data))} className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
                        <div className='space-y-2'>
                            <Label htmlFor="theme">Tema da Aula</Label>
                            <Input
                                id="theme"
                                placeholder="Ex: Introdução aos verbos irregulares"
                                {...register('theme')}
                                autoFocus
                            />
                            <FormMessageError error={errors.theme} />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="class_id">Turma</Label>
                            <Controller
                                name="class_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione uma turma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    <div className="flex flex-col">
                                                        <span>{c.name}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {c.courses.name} • {c._count.users_in_class} alunos
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FormMessageError error={errors.class_id} />
                        </div>

                        {selectedClass && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-medium">Informações da Turma Selecionada</h4>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <Badge variant="secondary">
                                        Curso: {selectedClass.courses.name}
                                    </Badge>
                                    <Badge variant="secondary">
                                        Alunos: {selectedClass._count.users_in_class}
                                    </Badge>
                                    <Badge variant="secondary">
                                        Vagas: {selectedClass.vacancies}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor="start_date">Data/Hora de Início</Label>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        value={field.value && field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                                            field.onChange(dateValue);
                                        }}
                                    />
                                )}
                            />
                            <FormMessageError error={errors.start_date} />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="end_date">Data/Hora de Fim</Label>
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="datetime-local"
                                        value={field.value && field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value ? new Date(e.target.value) : undefined;
                                            field.onChange(dateValue);
                                        }}
                                    />
                                )}
                            />
                            <FormMessageError error={errors.end_date} />
                        </div>

                        <div className="lg:col-span-3 w-[30rem] p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <PlusCircle className="w-5 h-5" />
                                <span className="font-medium">Lista de Presença Automática</span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                Ao criar a aula, uma lista de presença será gerada automaticamente com todos os alunos da turma selecionada.
                                Você poderá marcar as presenças na tela de edição da aula.
                            </p>
                        </div>

                        <CardFooter className="flex justify-end gap-2 lg:col-span-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('?tab=list')}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                                {isPending ? "Criando..." : "Criar Aula"}
                                {!isPending && <Save className="ml-2 w-4 h-4" />}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}