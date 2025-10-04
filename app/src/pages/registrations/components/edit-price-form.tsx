import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { editRegistration } from "@/services/registrations/edit-registration";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { GetRegistrationsResponseType } from "@idiomax/validation-schemas/registrations/get-registrations";

type Registration = GetRegistrationsResponseType[0];

export function EditPriceForm({ registration }: { registration: Registration }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [newPrice, setNewPrice] = useState(Number(registration.monthly_fee_amount).toString());

    const { mutate, isPending } = useMutation({
        mutationFn: () => editRegistration({
            id: registration.id,
            company_id: registration.company_id || getCurrentCompanyId(),
            monthly_fee_amount: Number(newPrice),
            locked: registration.locked || false,
            completed: registration.completed || false,
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

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (open) {
            setNewPrice(Number(registration.monthly_fee_amount).toString());
        }
    };

    const isValidPrice = () => {
        const price = Number(newPrice);
        return !isNaN(price) && price >= 0 && price <= 99999.99;
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Editar Preço
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Editar Valor da Mensalidade</AlertDialogTitle>
                    <AlertDialogDescription>
                        Altere o valor da mensalidade para <strong>{registration.users?.name}</strong>.
                        <br />
                        <strong>Valor atual:</strong> R$ {Number(registration.monthly_fee_amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Novo Valor
                        </Label>
                        <div className="col-span-3 relative">
                            <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">R$</span>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                max="99999.99"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="pl-10"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                </div>
                <AlertDialogFooter className="!justify-between">
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate()}
                        disabled={isPending || !isValidPrice()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isPending ? 'Salvando...' : 'Salvar Alteração'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}