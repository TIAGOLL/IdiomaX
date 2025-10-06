import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DollarSign, Info, Save } from "lucide-react";
import { useState } from "react";
import { editRegistration } from "@/services/registrations/edit-registration";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { GetRegistrationByIdResponseType } from "@idiomax/validation-schemas/registrations/get-registrations";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormMessageError } from "@/components/ui/form-message-error";
import { EditRegistrationFormSchema } from "@idiomax/validation-schemas/registrations/edit-registration";

type EditRegistrationFormSchema = z.infer<typeof EditRegistrationFormSchema>;

export function EditPriceForm({ registration }: { registration: GetRegistrationByIdResponseType }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: zodResolver(EditRegistrationFormSchema.omit({
            completed: true,
            locked: true,
        })),
        mode: "onChange",
        defaultValues: {
            monthly_fee_amount: Number(registration.monthly_fee_amount),
            discount_payment_before_due_date: Number(registration.discount_payment_before_due_date),
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: EditRegistrationFormSchema) => editRegistration({
            id: registration.id,
            company_id: getCurrentCompanyId(),
            locked: registration.locked,
            completed: registration.completed,
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registrations', getCurrentCompanyId()] });
            setOpen(false);
            reset();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                }}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Editar Preço
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Editar Valor da Mensalidade</AlertDialogTitle>
                    <AlertDialogDescription className="font-semibold flex items-center">
                        <Info className="inline mr-2 size-4" />
                        Só entrará em vigor para as próximas matriculas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit((data) => mutate(data))}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="monthly_fee_amount">
                                    Novo Valor da Mensalidade (R$)
                                </Label>
                                <Input
                                    id="monthly_fee_amount"
                                    placeholder="0.00"
                                    {...register('monthly_fee_amount', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.monthly_fee_amount} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount_payment_before_due_date">
                                    Desconto por Pagamento Antecipado (R$)
                                </Label>
                                <Input
                                    id="discount_payment_before_due_date"
                                    placeholder="0.00"
                                    {...register('discount_payment_before_due_date', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.discount_payment_before_due_date} />
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="!justify-between">
                        <AlertDialogCancel disabled={isPending} type="button">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending || !isValid}
                            asChild
                        >
                            <Button type="submit" variant="default" disabled={isPending || !isValid}>
                                <Save className="mr-2 size-4" />
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog >
    );
}