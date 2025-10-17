import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteRegistration } from "@/services/registrations/delete-registration";
import { Button } from "@/components/ui/button";
import type { GetRegistrationByIdResponseType } from "@idiomax/validation-schemas/registrations";
import { useSearchParams } from "react-router";


export function DeleteRegistrationForm({ registration }: { registration: GetRegistrationByIdResponseType }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [, setSearchParams] = useSearchParams();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteRegistration({
            id: registration.id,
            company_id: getCurrentCompanyId(),
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['registration', registration.id] });
            setOpen(false);
            setSearchParams({ tab: 'list' })
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"
                    onClick={() => setOpen(true)}
                    className="w-full"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Matrícula
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Matrícula</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a matrícula de <strong>{registration.user?.name}</strong>?
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
                        asChild
                    >
                        <Button variant="destructive" disabled={isPending}>
                            {isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}