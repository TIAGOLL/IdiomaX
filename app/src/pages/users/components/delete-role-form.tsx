import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UserRole, UserWithRole } from '@idiomax/http-schemas/users/get-users';
import { removeUserRole } from '@/services/roles/manage-roles';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { UpdateUserRoleFormSchema } from '@idiomax/http-schemas/roles/update-user-role';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UpdateUserRoleFormSchema = z.infer<typeof UpdateUserRoleFormSchema>;

export function DeleteRoleForm({ user, role }: { user: UserWithRole, role: UserRole }) {

    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateUserRoleFormSchema) => removeUserRole({
            user_id: user.id,
            company_id: getCurrentCompanyId(),
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
            setOpen(false);
            reset();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const { handleSubmit, reset } = useForm({
        resolver: zodResolver(UpdateUserRoleFormSchema),
        defaultValues: {
            role: role,
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remover Role Principal</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você está removendo a role.
                        Isso pode afetar as permissões do usuário.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending} onClick={() => {
                        reset()
                        setOpen(false)
                    }}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleSubmit((data) => mutate(data))}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? 'Removendo...' : 'Confirmar'}
                        {isPending && <Loader className="ml-2 size-4 animate-spin" />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}