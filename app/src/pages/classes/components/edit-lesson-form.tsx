import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, LoaderIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateLesson } from '@/services/lessons/update-lesson';
import { getCurrentCompanyId } from '@/lib/company-utils';
import type { GetLessonByIdResponseType } from '@idiomax/validation-schemas/lessons';
import { UpdateLessonFormSchema } from '@idiomax/validation-schemas/lessons';

type UpdateLessonRequest = z.infer<typeof UpdateLessonFormSchema>;

export function EditLessonForm({ lesson }: { lesson: GetLessonByIdResponseType }) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateLessonRequest) => {
            const response = await updateLesson({
                id: lesson.id,
                company_id: getCurrentCompanyId(),
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(UpdateLessonFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            theme: lesson.theme,
            start_date: new Date(lesson.start_date),
            end_date: new Date(lesson.end_date),
        }
    });

    if (!lesson) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações da Aula</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
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
                    </div>
                </CardContent>
                <CardFooter className='justify-end mt-5'>
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                        {isPending ? "Salvando..." : "Salvar"}
                        <Save className="ml-2 w-4 h-4" />
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}