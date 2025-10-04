import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteRegistration } from "@/services/registrations/delete-registration";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { GetRegistrationsResponseType } from "@idiomax/validation-schemas/registrations/get-registrations";

type Registration = GetRegistrationsResponseType[0];

export function DeleteRegistrationForm({ registration }: { registration: Registration }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRegistration({
            id: registration.id,
            company_id: registration.company_id || getCurrentCompanyId(),
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registrations', getCurrentCompanyId()] });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Matrícula
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Matrícula</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a matrícula de <strong>{registration.users?.name}</strong>?
                        Esta ação não pode ser desfeita e todos os dados da matrícula serão permanentemente removidos.
                        <br /><br />
                        <strong>Data de Início:</strong> {new Date(registration.start_date).toLocaleDateString('pt-BR')}
                        <br />
                        <strong>Valor Mensal:</strong> R$ {Number(registration.monthly_fee_amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-between">
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}