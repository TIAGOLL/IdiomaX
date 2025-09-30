import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRegistrationTimeFormSchema } from '@idiomax/validation-schemas/settings/update-registration-time';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessageError } from "@/components/ui/form-message-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { updateRegistrationTime } from "@/services/settings/update-registration-time";
import { Loader, Save } from "lucide-react";
import { useSessionContext } from "@/contexts/session-context";
import { useEffect } from "react";
import { getCurrentCompanyId } from "@/lib/company-utils";

export type UpdateRegistrationTimeFormSchema = z.infer<typeof UpdateRegistrationTimeFormSchema>;

interface UpdateRegistrationTimeFormProps {
    currentValue?: number;
}

export function UpdateRegistrationTimeForm({ currentValue }: UpdateRegistrationTimeFormProps) {
    const queryClient = useQueryClient();
    const { currentCompanyMember } = useSessionContext();

    const { register, handleSubmit, formState: { errors }, setValue } =
        useForm({
            resolver: zodResolver(UpdateRegistrationTimeFormSchema),
        });

    // Define o valor inicial quando currentValue muda
    useEffect(() => {
        if (currentValue) {
            setValue('registration_time', currentValue);
        }
    }, [currentValue, setValue]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateRegistrationTimeFormSchema) => updateRegistrationTime({
            registration_time: data.registration_time,
            company_id: getCurrentCompanyId()
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            // Invalidar a query das configurações para atualizar os dados
            queryClient.invalidateQueries({
                queryKey: ['company-settings', currentCompanyMember?.company.id]
            });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <>
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="registrationTime">Tempo (meses)</Label>
                    <Input
                        id="registration_time"
                        type="number"
                        {...register('registration_time', { valueAsNumber: true })}
                        placeholder="Digite o tempo em meses (ex: 6)"
                    />
                    <FormMessageError error={errors?.registration_time?.message} />
                    <p className="text-sm text-muted-foreground">
                        Define a duração padrão das matrículas (1 a 60 meses).
                    </p>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? 'Atualizando...' : 'Salvar'}
                        {isPending && <Loader className="animate-spin ml-2 size-4" />}
                        {!isPending && <Save className="ml-2 size-4" />}
                    </Button>
                </div>
            </form>
        </>
    );
}