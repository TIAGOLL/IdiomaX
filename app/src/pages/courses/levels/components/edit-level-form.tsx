import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { CreateLevelFormSchema, type CreateLevelFormData } from '@idiomax/validation-schemas/levels/create-level';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateLevel } from '@/services/levels';
import { useEffect, useState } from 'react';
import type { Level } from '@idiomax/validation-schemas/levels/get-levels';
import type { GetCourseByIdResponse } from '@idiomax/validation-schemas/courses/get-course-by-id';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function EditLevelForm(
    { course, level }: { course: GetCourseByIdResponse; level: Level }
) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    // Mutation para atualizar level
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateLevelFormData) => {
            const response = await updateLevel({
                ...data,
                company_id: getCurrentCompanyId(),
                course_id: course.id,
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', course.id] });
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
    } = useForm<CreateLevelFormData>({
        resolver: zodResolver(CreateLevelFormSchema) as Resolver<CreateLevelFormData>,
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: '',
            level: 1,
        }
    });

    // Preencher formulário quando level mudar
    useEffect(() => {
        setValue('name', level.name);
        setValue('level', level.level);
    }, [level, setValue]);

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
                    Editar nível "{level.name}"
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Editar Nível</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome do Nível *</Label>
                            <Input
                                id="edit-name"
                                placeholder="Ex: Básico I, Intermediário II"
                                {...register('name')}
                            />
                            <FormMessageError error={errors.name?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-level">Ordem do Nível *</Label>
                            <Input
                                id="edit-level"
                                type="number"
                                min="1"
                                placeholder="1"
                                {...register('level', { valueAsNumber: true })}
                            />
                            <FormMessageError error={errors.level?.message} />
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
                                    Atualizar Nível
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}