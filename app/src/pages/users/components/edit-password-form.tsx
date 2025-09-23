import { useMutation } from "@tanstack/react-query";
import { AdminResetPasswordFormSchema } from '@idiomax/http-schemas/users/admin-reset-password';
import { adminResetPassword } from "@/services/users";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessageError } from "@/components/ui/form-message-error";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { UserWithRole } from "@idiomax/http-schemas/users/get-users";
import type z from "zod";

export type AdminResetPasswordFormData = z.infer<typeof AdminResetPasswordFormSchema>;

export function EditPasswordForm({ user }: { user: UserWithRole }) {

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } =
        useForm({
            resolver: zodResolver(AdminResetPasswordFormSchema),
        });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: AdminResetPasswordFormData) => adminResetPassword({
            password: data.password,
            company_id: getCurrentCompanyId(),
            user_id: user.id,
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
            setShowPasswordForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <>
            {!showPasswordForm ? (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPasswordForm(true)}
                >
                    Redefinir Senha
                </Button>
            ) : (
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova senha</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder="Digite a nova senha"
                        />
                        <FormMessageError error={errors?.password?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirmar senha</Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            {...register('confirm_password')}
                            placeholder="Confirme a nova senha"
                        />
                        <FormMessageError error={errors?.confirm_password?.message} />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setShowPasswordForm(false);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending}
                        >
                            {isPending ? 'Redefinindo...' : 'Redefinir Senha'}
                        </Button>
                    </div>
                </form>
            )}
        </>
    )
}