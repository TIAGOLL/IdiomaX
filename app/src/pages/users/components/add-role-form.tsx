import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUserRole } from "@/services/roles/manage-roles";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserWithRole } from "@idiomax/validation-schemas/users/get-users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Users } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdateUserRoleFormSchema } from "@idiomax/validation-schemas/roles/update-user-role";
import type z from "zod";
import { getCurrentCompanyId } from "@/lib/company-utils";

type UpdateUserRoleFormSchema = z.infer<typeof UpdateUserRoleFormSchema>;

export function AddRoleForm({ user }: { user: UserWithRole }) {
    const [showRoleForm, setShowRoleForm] = useState(false);
    const queryClient = useQueryClient();

    const { isPending, mutate } = useMutation({
        mutationFn: (data: UpdateUserRoleFormSchema) => addUserRole({
            user_id: user.id,
            company_id: getCurrentCompanyId(),
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
            reset();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const { handleSubmit, reset, control } = useForm({
        resolver: zodResolver(UpdateUserRoleFormSchema)
    })

    if (!showRoleForm) {
        return (
            <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => setShowRoleForm(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar Role
                </Button>
            </div>
        )
    }
    return (
        <>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-3">
                <div className="space-y-2">
                    <Label htmlFor="role">Nova Função</Label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                    {!user.member_on.find(m => m.role === 'STUDENT')?.role && (<SelectItem value="STUDENT">🎓 Estudante</SelectItem>)}
                                    {!user.member_on.find(m => m.role === 'TEACHER')?.role && (<SelectItem value="TEACHER">👨‍🏫 Professor</SelectItem>)}
                                    {!user.member_on.find(m => m.role === 'ADMIN')?.role && (<SelectItem value="ADMIN">👑 Administrador</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setShowRoleForm(false);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        disabled={isPending}
                    >
                        {isPending ? 'Adicionando...' : 'Adicionar Role'}
                        {isPending && <Loader className='ml-2 size-4 animate-spin' />}
                    </Button>
                </div>
            </form>
        </>
    )
}