import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { UpdateClassroomFormSchema } from '@idiomax/validation-schemas/classrooms/update-classroom';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateClassroom, } from '@/services/classrooms';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { z } from 'zod';
import type { GetClassroomsResponseSchema } from '@idiomax/validation-schemas/classrooms/get-classrooms';
import { zodResolver } from '@hookform/resolvers/zod';

type GetClassroomsResponse = z.infer<typeof GetClassroomsResponseSchema>;
type UpdateClassroomForm = z.infer<typeof UpdateClassroomFormSchema>;

export function UpdateClassroomForm({ classroom }: { classroom: GetClassroomsResponse[number] }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    // Mutation para atualizar classroom
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: UpdateClassroomForm) => await updateClassroom({
            id: classroom.id,
            company_id: classroom.company_id,
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
            setOpen(false);
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<UpdateClassroomForm>({
        resolver: zodResolver(UpdateClassroomFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            number: 1,
            block: '',
        }
    });

    useEffect(() => {
        setValue('number', classroom.number);
        setValue('block', classroom.block);
    }, [classroom, setValue]);

    const handleCancel = () => {
        setOpen(false);
        reset();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger
                        asChild
                        disabled={isPending}
                    >
                        <Button variant="outline" size="icon">
                            <Edit2 className="size-4" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-3">
                    Editar sala "{classroom.number}"
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Editar Sala de Aula</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-number">Número da Sala *</Label>
                            <Input
                                id="edit-number"
                                type="number"
                                min="1"
                                placeholder="101"
                                {...register('number', { valueAsNumber: true })}
                            />
                            <FormMessageError error={errors.number?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-block">Bloco</Label>
                            <Input
                                id="edit-block"
                                placeholder="Ex: A, B, Principal"
                                {...register('block')}
                            />
                            <FormMessageError error={errors.block?.message} />
                        </div>
                    </div>
                    <AlertDialogFooter className="flex !justify-between gap-2 pt-4">
                        <AlertDialogCancel
                            type="button"
                            className={buttonVariants({ variant: 'outline' })}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <Edit2 className="size-4 mr-2" />
                                    Atualizar Sala
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}