import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, LoaderIcon, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { CreateCourseFormSchema } from '@idiomax/http-schemas/courses/create-course';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createCourse } from '@/services/courses';
import { getCurrentCompanyId } from '@/lib/company-utils';

type CreateCourseRequest = z.infer<typeof CreateCourseFormSchema>;

export function CreateCoursePage() {

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateCourseRequest) => {
            const response = await createCourse(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            console.log(res);
            reset();
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateCourseRequest>({
        resolver: zodResolver(CreateCourseFormSchema) as Resolver<CreateCourseRequest>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            company_id: getCurrentCompanyId(),
            name: 'Teste 1',
            description: 'Teste',
            registration_value: 400,
            workload: 30,
            monthly_fee_value: 200,
            minimum_grade: 70,
            maximum_grade: 100,
            minimum_frequency: 75,
            syllabus_url: ''
        }
    });

    return (
        <div className='flex justify-center items-center sm:w-full'>
            <Card className='w-full'>
                <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
                    <CardHeader className='flex space-x-4 flex-col'>
                        <div className='flex-col'>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="size-5" />
                                Cadastrar Curso
                            </CardTitle>
                            <CardDescription>Preencha os dados para cadastrar um novo curso</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                            {/* Nome do Curso */}
                            <div className="col-span-2 space-y-1">
                                <Label htmlFor='name'>Nome do Curso *</Label>
                                <Input
                                    type='text'
                                    id='name'
                                    placeholder="Ex: Inglês Básico, Espanhol Avançado"
                                    {...register('name')}
                                />
                                <FormMessageError error={errors.name?.message} />
                            </div>

                            {/* Carga Horária */}
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='workload'>Carga Horária (horas) *</Label>
                                <Input
                                    type='number'
                                    id='workload'
                                    placeholder="40"
                                    min="1"
                                    {...register('workload', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.workload?.message} />
                            </div>

                            {/* Descrição */}
                            <div className="col-span-3 space-y-1">
                                <Label htmlFor='description'>Descrição</Label>
                                <Textarea
                                    id='description'
                                    placeholder="Descrição detalhada do curso, objetivos e metodologia"
                                    rows={3}
                                    {...register('description')}
                                />
                                <FormMessageError error={errors.description?.message} />
                            </div>

                            {/* Valores Financeiros */}
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='registration_value'>Valor da Matrícula (R$) *</Label>
                                <Input
                                    type='number'
                                    id='registration_value'
                                    placeholder="150.00"
                                    step="0.01"
                                    min="0"
                                    {...register('registration_value', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.registration_value?.message} />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='monthly_fee_value'>Mensalidade (R$) *</Label>
                                <Input
                                    type='number'
                                    id='monthly_fee_value'
                                    placeholder="250.00"
                                    step="0.01"
                                    min="0"
                                    {...register('monthly_fee_value', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.monthly_fee_value?.message} />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='minimum_frequency'>Frequência Mínima (%) *</Label>
                                <Input
                                    type='number'
                                    id='minimum_frequency'
                                    placeholder="75"
                                    min="0"
                                    max="100"
                                    {...register('minimum_frequency', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.minimum_frequency?.message} />
                            </div>

                            {/* Notas */}
                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='minimum_grade'>Nota Mínima (%) *</Label>
                                <Input
                                    type='number'
                                    id='minimum_grade'
                                    placeholder="60"
                                    min="0"
                                    max="100"
                                    {...register('minimum_grade', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.minimum_grade?.message} />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <Label htmlFor='maximum_grade'>Nota Máxima (%) *</Label>
                                <Input
                                    type='number'
                                    id='maximum_grade'
                                    placeholder="100"
                                    min="0"
                                    max="100"
                                    {...register('maximum_grade', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.maximum_grade?.message} />
                            </div>

                            {/* Ementa */}
                            <div className="col-span-3 space-y-1">
                                <Label htmlFor=' syllabus_url'>Ementa do Curso</Label>
                                <Textarea
                                    id=' syllabus_url'
                                    placeholder="Conteúdo programático detalhado, tópicos abordados por módulo..."
                                    rows={4}
                                    {...register(' syllabus_url')}
                                />
                                <FormMessageError error={errors.syllabus_url?.message} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between flex-row-reverse'>
                        <Button
                            variant='default'
                            type='submit'
                            onClick={() => console.log(errors)}
                            disabled={isPending}
                        >
                            Cadastrar Curso
                            {isPending ? (
                                <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                            ) : (
                                <PlusCircle className='ml-2 h-4 w-4' />
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
