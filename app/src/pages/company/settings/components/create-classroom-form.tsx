import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateClassroomFormSchema } from '@idiomax/http-schemas/classrooms/create-classroom';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createClassroom } from '@/services/classrooms';
import { getCurrentCompanyId } from '@/lib/company-utils';

type CreateClassroomFormSchema = z.infer<typeof CreateClassroomFormSchema>;

export function CreateClassroomForm() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateClassroomFormSchema) => {
            const response = await createClassroom({
                ...data,
                companies_id: getCurrentCompanyId()
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateClassroomFormSchema>({
        resolver: zodResolver(CreateClassroomFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            number: 1,
            block: ''
        }
    });

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Número da Sala */}
                <div className="space-y-1">
                    <Label htmlFor='number'>Número da Sala *</Label>
                    <Input
                        type='number'
                        id='number'
                        placeholder="101"
                        min="1"
                        {...register('number', { valueAsNumber: true })}
                    />
                    <FormMessageError error={errors.number?.message} />
                </div>

                {/* Bloco */}
                <div className="space-y-1">
                    <Label htmlFor='block'>Bloco</Label>
                    <Input
                        type='text'
                        id='block'
                        placeholder="Ex: A, B, Principal"
                        {...register('block')}
                    />
                    <FormMessageError error={errors.block?.message} />
                </div>
                <div className="space-y-1 items-end flex">
                    <Button
                        variant='default'
                        type='submit'
                        disabled={isPending}
                    >
                        Cadastrar Sala
                        {isPending ? (
                            <LoaderIcon className='ml-2 size-4 animate-spin' />
                        ) : (
                            <PlusCircle className='ml-2 size-4' />
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}