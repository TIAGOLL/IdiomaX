import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, LoaderIcon, Save } from 'lucide-react';
import { useForm, } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLevelFormSchema, type CreateLevelFormData } from '@idiomax/http-schemas/levels/create-level';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLevel } from '@/services/levels';
import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { useState } from 'react';

export function CreateLevelForm({ course, trigger }: { course: GetCourseByIdResponse; trigger?: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    // Mutation para criar level
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateLevelFormData) => {
            const response = await createLevel({
                company_id: getCurrentCompanyId(),
                course_id: course.id,
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['levels', course.id] });
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao criar level');
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateLevelFormData>({
        resolver: zodResolver(CreateLevelFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: '',
            level: 1,
        }
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild onClick={() => { setOpen(true) }}>
                {trigger || (
                    <Button variant="default" size="sm">
                        <PlusCircle className="size-4 mr-2" />
                        Novo Nível
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[100vw] min-w-[30vw] min-h-[30vh]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Criar Novo Nível</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                    <div className="w-[30em] gap-4 flex justify-center flex-col">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Nível *</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Básico I, Intermediário II"
                                {...register('name')}
                            />
                            <FormMessageError error={errors.name?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Ordem do Nível *</Label>
                            <Input
                                id="level"
                                type="number"
                                min="1"
                                placeholder="1"
                                {...register('level', { valueAsNumber: true })}
                            />
                            <FormMessageError error={errors.level?.message} />
                        </div>
                    </div>
                    <Separator />
                    <AlertDialogFooter className="flex !justify-between w-full">
                        <AlertDialogCancel disabled={isPending} onClick={() => { setOpen(false); reset() }}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    Criando...
                                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Criar Nível
                                    <Save className="size-4 mr-2" />
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}