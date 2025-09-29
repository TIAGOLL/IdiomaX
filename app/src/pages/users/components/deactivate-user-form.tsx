import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { UserWithRole } from '@idiomax/validation-schemas/users/get-users';
import z from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { DeactivateUserFormSchema } from '@idiomax/validation-schemas/users/deactivate-user';
import { UserCheck, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deactivateUser } from '@/services/users/deactivate-user';

type DeactivateUserFormSchema = z.infer<typeof DeactivateUserFormSchema>;

export function DeactivateUserForm({ user }: { user: UserWithRole }) {

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeactivateUserFormSchema) => deactivateUser({
            user_id: user.id,
            company_id: getCurrentCompanyId(),
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const { handleSubmit, setValue } = useForm({
        resolver: zodResolver(DeactivateUserFormSchema),
    })

    useEffect(() => {
        setValue('active', !user.active);
    }, [setValue, user]);

    return (
        <>
            <Button variant="outline" className="w-full" onClick={handleSubmit((data) => { console.log(user.active); mutate(data) })} disabled={isPending}>
                {user.active ? (
                    <>
                        <UserX className="size-4 mr-2" />
                        {isPending ? 'Desativando...' : 'Desativar Usuário'}
                    </>
                ) : (
                    <>
                        <UserCheck className="size-4 mr-2" />
                        {isPending ? 'Ativando...' : 'Ativar Usuário'}
                    </>
                )}
            </Button>
        </>
    )
}