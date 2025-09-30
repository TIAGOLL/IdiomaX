import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { alterUserRole } from "@/services/roles/alter-user-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Users } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AlterUserRoleFormSchema } from "@idiomax/validation-schemas/roles/alter-user-role";
import type z from "zod";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { GetUserByIdResponseType } from "@idiomax/validation-schemas/users/get-user-by-id";

type AlterUserRoleFormSchema = z.infer<typeof AlterUserRoleFormSchema>;

export function AlterRoleForm({ user }: { user: GetUserByIdResponseType }) {
    const [showRoleForm, setShowRoleForm] = useState(false);
    const queryClient = useQueryClient();

    const { isPending, mutate } = useMutation({
        mutationFn: (data: AlterUserRoleFormSchema) => alterUserRole({
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
        resolver: zodResolver(AlterUserRoleFormSchema)
    })

    if (!showRoleForm) {
        return (
            <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => setShowRoleForm(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Alterar Role
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
                        {isPending ? 'Alterando...' : 'Alterar Role'}
                        {isPending && <Loader className='ml-2 size-4 animate-spin' />}
                    </Button>
                </div>
            </form>
        </>
    )
}