import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { type GetClassByIdResponseType, UpdateClassFormSchema } from '@idiomax/validation-schemas/class';
import { editClass } from '@/services/class/edit-class';

type UpdateClassFormSchema = z.infer<typeof UpdateClassFormSchema>;

export function EditClassForm({ class: classData }: { class: GetClassByIdResponseType }) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateClassFormSchema) => {
            const response = await editClass({
                company_id: getCurrentCompanyId(),
                id: classData.id,
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['class', classData.id] });
            queryClient.invalidateQueries({ queryKey: ['classes', getCurrentCompanyId()] });
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
    } = useForm({
        resolver: zodResolver(UpdateClassFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: classData.name,
            vacancies: classData.vacancies,
        }
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
            <div className="sm:grid flex flex-col sm:grid-cols-3 gap-4">
                {/* Nome da Turma */}
                <div className="col-span-2 space-y-1">
                    <Label htmlFor='name'>Nome da Turma *</Label>
                    <Input
                        type='text'
                        id='name'
                        {...register('name')}
                    />
                    <FormMessageError error={errors.name?.message} />
                </div>

                {/* Vagas da turma */}
                <div className="col-span-1 space-y-1">
                    <Label htmlFor='vacancies'>Vagas da turma *</Label>
                    <Input
                        type='number'
                        id='vacancies'
                        placeholder="30"
                        {...register('vacancies', { valueAsNumber: true })}
                    />
                    <FormMessageError error={errors.vacancies?.message} />
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