import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon, Save, ArrowLeft, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateLessonFormSchema } from '@idiomax/validation-schemas/lessons/update-lesson';
import { UpdatePresenceFormSchema } from '@idiomax/validation-schemas/lessons/update-presence';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { updateLesson } from '@/services/lessons/update-lesson';
import { updatePresence } from '@/services/lessons/update-presence';
import { getLessonById } from '@/services/lessons/get-lesson-by-id';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type UpdateLessonFormSchema = z.infer<typeof UpdateLessonFormSchema>;
type UpdatePresenceFormSchema = z.infer<typeof UpdatePresenceFormSchema>;

interface EditLessonPageProps {
    lessonId: string;
}

export function EditLessonPage({ lessonId }: EditLessonPageProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [presenceList, setPresenceList] = useState<{ id: string; is_present: boolean; }[]>([]);

    const { data: lesson, isPending: isLoadingLesson } = useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => getLessonById({
            id: lessonId,
            company_id: getCurrentCompanyId()
        }),
        enabled: !!lessonId && !!getCurrentCompanyId(),
    });

    // Sincronizar presenceList com os dados da aula
    useEffect(() => {
        if (lesson?.presence_list) {
            setPresenceList(
                lesson.presence_list.map(p => ({
                    id: p.id,
                    is_present: p.is_present
                }))
            );
        }
    }, [lesson]);

    const updateLessonMutation = useMutation({
        mutationFn: async (data: UpdateLessonFormSchema) => {
            const response = await updateLesson({
                id: lessonId,
                company_id: getCurrentCompanyId(),
                theme: data.theme,
                start_date: data.start_date.toISOString(),
                end_date: data.end_date.toISOString(),
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const updatePresenceMutation = useMutation({
        mutationFn: async (data: UpdatePresenceFormSchema) => {
            const response = await updatePresence({
                lesson_id: lessonId,
                company_id: getCurrentCompanyId(),
                presence_list: data.presence_list
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm<UpdateLessonFormSchema>({
        resolver: zodResolver(UpdateLessonFormSchema),
        mode: "all",
        criteriaMode: "all",
    });

    // Definir valores iniciais quando os dados da aula carregarem
    useEffect(() => {
        if (lesson) {
            setValue('theme', lesson.theme);
            setValue('start_date', new Date(lesson.start_date));
            setValue('end_date', new Date(lesson.end_date));
        }
    }, [lesson, setValue]);

    const handlePresenceChange = (presenceId: string, isPresent: boolean) => {
        setPresenceList(prev =>
            prev.map(p =>
                p.id === presenceId ? { ...p, is_present: isPresent } : p
            )
        );
    };

    const handleSavePresence = () => {
        updatePresenceMutation.mutate({ presence_list: presenceList });
    };

    if (isLoadingLesson) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Aula não encontrada.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const presentCount = presenceList.filter(p => p.is_present).length;
    const totalStudents = lesson.class.users_in_class.filter(u => !u.teacher).length;

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
                            Editar Aula
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Edite os dados da aula e gerencie a lista de presença dos alunos.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dados da Aula */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Aula</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit((data) => updateLessonMutation.mutate(data))}>
                        <CardContent className="space-y-4">
                            <div className='space-y-2'>
                                <Label htmlFor="theme">Tema da Aula</Label>
                                <Input
                                    id="theme"
                                    {...register('theme')}
                                />
                                <FormMessageError error={errors.theme} />
                            </div>

                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-medium">Turma: {lesson.class.name}</h4>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <Badge variant="secondary">
                                        Curso: {lesson.class.courses.name}
                                    </Badge>
                                    <Badge variant="secondary">
                                        Vagas: {lesson.class.vacancies}
                                    </Badge>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor="start_date">Data/Hora de Início</Label>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="datetime-local"
                                                value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => {
                                                    const date = e.target.value ? new Date(e.target.value) : null;
                                                    field.onChange(date);
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
                                                value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => {
                                                    const date = e.target.value ? new Date(e.target.value) : null;
                                                    field.onChange(date);
                                                }}
                                            />
                                        )}
                                    />
                                    <FormMessageError error={errors.end_date} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={updateLessonMutation.isPending}
                                className="w-full"
                            >
                                {updateLessonMutation.isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                                {updateLessonMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Lista de Presença */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Lista de Presença
                            </CardTitle>
                            <Badge variant={presentCount === totalStudents ? "default" : "secondary"}>
                                {presentCount}/{totalStudents} presentes
                            </Badge>
                        </div>
                        <CardDescription>
                            Marque os alunos presentes na aula.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Aluno</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Presente</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lesson.presence_list.map((presence) => {
                                        const isPresent = presenceList.find(p => p.id === presence.id)?.is_present || false;
                                        return (
                                            <TableRow key={presence.id}>
                                                <TableCell className="font-medium">
                                                    {presence.users.name}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {presence.users.email}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={isPresent}
                                                            onCheckedChange={(checked) =>
                                                                handlePresenceChange(presence.id, checked as boolean)
                                                            }
                                                        />
                                                        {isPresent ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSavePresence}
                            disabled={updatePresenceMutation.isPending}
                            className="w-full"
                        >
                            {updatePresenceMutation.isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                            {updatePresenceMutation.isPending ? "Salvando..." : "Salvar Presença"}
                            <Save className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}