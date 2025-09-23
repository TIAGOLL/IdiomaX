import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { UpdateCourseFormSchema } from '@idiomax/http-schemas/courses/update-course';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateCourse } from '@/services/courses';
import { getCurrentCompanyId } from '@/lib/company-utils';

type UpdateCourseRequest = z.infer<typeof UpdateCourseFormSchema>;

interface EditCourseFormProps {
    course: {
        id: string;
        name: string;
        description: string | null;
        registration_value: number;
        workload: number;
        monthly_fee_value: number;
        minimum_grade: number;
        maximum_grade: number;
        minimum_frequency: number;
        syllabus: string | null;
        companies_id: string;
        active: boolean;
    };
}

export function EditCourseForm({ course }: EditCourseFormProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateCourseRequest) => {
            const response = await updateCourse(data);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            // Invalidar query para atualizar dados na tela
            queryClient.invalidateQueries({ queryKey: ['course', course.id] });
            queryClient.invalidateQueries({ queryKey: ['courses', getCurrentCompanyId()] });
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UpdateCourseRequest>({
        resolver: zodResolver(UpdateCourseFormSchema) as Resolver<UpdateCourseRequest>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            id: course.id,
            company_id: course.companies_id,
            name: course.name,
            description: course.description || '',
            registration_value: course.registration_value,
            workload: course.workload,
            monthly_fee_value: course.monthly_fee_value,
            minimum_grade: course.minimum_grade,
            maximum_grade: course.maximum_grade,
            minimum_frequency: course.minimum_frequency,
            syllabus: course.syllabus || '',
            active: course.active
        }
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
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
                    <Label htmlFor='syllabus'>Ementa do Curso</Label>
                    <Textarea
                        id='syllabus'
                        placeholder="Conteúdo programático detalhado, tópicos abordados por módulo..."
                        rows={4}
                        {...register('syllabus')}
                    />
                    <FormMessageError error={errors.syllabus?.message} />
                </div>
            </div>

            <div className='flex justify-end pt-4'>
                <Button
                    variant='default'
                    type='submit'
                    disabled={isPending}
                >
                    Salvar Alterações
                    {isPending ? (
                        <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                    ) : (
                        <Save className='ml-2 h-4 w-4' />
                    )}
                </Button>
            </div>
        </form>
    );
}