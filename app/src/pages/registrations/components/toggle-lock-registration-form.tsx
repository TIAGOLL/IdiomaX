import { editRegistration } from "@/services/registrations/edit-registration";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from '@/lib/company-utils';
import { Button } from "@/components/ui/button";
import type { GetRegistrationByIdResponseType } from "@idiomax/validation-schemas/registrations";

export function ToggleLockRegistrationForm({ registration }: { registration: GetRegistrationByIdResponseType }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const isLocked = registration.locked;

    const { mutate, isPending } = useMutation({
        mutationFn: () => editRegistration({
            id: registration.id,
            company_id: getCurrentCompanyId(),
            monthly_fee_amount: Number(registration.monthly_fee_amount),
            locked: !isLocked,
            discount_payment_before_due_date: Number(registration.discount_payment_before_due_date),
            completed: registration.completed || false,
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registration', registration.id] });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const actionText = isLocked ? 'Destrancar' : 'Trancar';
    const actionDescription = isLocked
        ? 'destrancar esta matrícula. O estudante poderá voltar a acessar normalmente.'
        : 'trancar esta matrícula. O estudante será impedido de acessar até que seja destrancada.';

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => setOpen(true)}
                    className="w-full"
                >
                    {isLocked ? (
                        <Unlock className="h-4 w-4 mr-2" />
                    ) : (
                        <Lock className="h-4 w-4 mr-2" />
                    )}
                    {actionText} Matrícula
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{actionText} Matrícula</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja {actionDescription}
                        <br /><br />
                        <strong>Estudante:</strong> {registration.user.name}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-between">
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate()}
                        disabled={isPending}
                        asChild
                    >
                        <Button variant={isLocked ? 'default' : 'destructive'}>
                            {isPending ? `${actionText}ando...` : `Confirmar`}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}