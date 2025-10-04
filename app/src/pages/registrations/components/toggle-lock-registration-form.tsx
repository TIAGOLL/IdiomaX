import { useMutation, useQueryClient } from "@tanstack/react-query"; import { useMutation, useQueryClient } from "@tanstack/react-query"; import { useMutation, useQueryClient } from "@tanstack/react-query"; import { useState } from 'react';

import { getCurrentCompanyId } from "@/lib/company-utils";

import { toast } from "sonner"; import { getCurrentCompanyId } from "@/lib/company-utils";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Lock, Unlock } from "lucide-react"; import { toast } from "sonner"; import { getCurrentCompanyId } from "@/lib/company-utils"; import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from "react";

import { editRegistration } from "@/services/registrations/edit-registration"; import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import type { GetRegistrationsResponseType } from "@idiomax/validation-schemas/registrations/get-registrations"; import { Lock, Unlock } from "lucide-react"; import { toast } from "sonner"; import { Button } from '@/components/ui/button';



type Registration = GetRegistrationsResponseType[0]; import { useState } from "react";



export function ToggleLockRegistrationForm({ registration }: { registration: Registration }) {
    import { editRegistration } from "@/services/registrations/edit-registration"; import { Button } from "@/components/ui/button"; import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false); import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

    const isLocked = registration.locked;

    import type { GetRegistrationsResponseType } from "@idiomax/validation-schemas/registrations/get-registrations"; import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; import { Lock, Unlock } from 'lucide-react';

    const { mutate, isPending } = useMutation({

        mutationFn: () => editRegistration({

            id: registration.id,

            company_id: registration.company_id || getCurrentCompanyId(), type Registration = GetRegistrationsResponseType[0]; import { Lock, Unlock } from "lucide-react"; import { getCurrentCompanyId } from '@/lib/company-utils';

            monthly_fee_amount: Number(registration.monthly_fee_amount),

            locked: !isLocked,

            completed: registration.completed || false,

        }), export function ToggleLockRegistrationForm({ registration }: { registration: Registration }) {
            import { useState } from "react"; import { editRegistration } from '@/services/registrations';

        onSuccess: (res) => {

            toast.success(res.message); const queryClient = useQueryClient();

            queryClient.invalidateQueries({ queryKey: ['registrations', getCurrentCompanyId()] });

            setOpen(false); const [open, setOpen] = useState(false); import { editRegistration } from "@/services/registrations/edit-registration";

        },

        onError: (error: Error) => {
            const isLocked = registration.locked;

            toast.error(error.message);

        }, import { DropdownMenuItem } from "@/components/ui/dropdown-menu"; interface ToggleLockRegistrationFormProps {

    });

    const { mutate, isPending } = useMutation({

        const actionText = isLocked ? 'Destrancar' : 'Trancar';

        mutationFn: () => editRegistration({ import type { GetRegistrationsResponseType } from "@idiomax/validation-schemas/registrations/get-registrations"; registrationId: string;

        return(

        <AlertDialog open = { open } onOpenChange = { setOpen } > id: registration.id,

            < AlertDialogTrigger asChild >

    <DropdownMenuItem onSelect={(e) => {
        company_id: registration.company_id || getCurrentCompanyId(), currentlyLocked: boolean;

        e.preventDefault();

        setOpen(true); monthly_fee_amount: Number(registration.monthly_fee_amount),

                }}>

        {isLocked ? (locked: !isLocked, // Toggle do estado atualtype Registration = GetRegistrationsResponseType[0];    isOpen: boolean;

                        <Unlock className = "h-4 w-4 mr-2" />

                    ): (completed: registration.completed || false,

        <Lock className="h-4 w-4 mr-2" />

                    )}        }),    onClose: () => void;

        {actionText} Matrícula

    </DropdownMenuItem>        onSuccess: (res) => {

            </AlertDialogTrigger >

        <AlertDialogContent>            toast.success(res.message);export function ToggleLockRegistrationForm({registration}: {registration: Registration }) {studentName ?: string;

            <AlertDialogHeader>

                <AlertDialogTitle>{actionText} Matrícula</AlertDialogTitle>            queryClient.invalidateQueries({queryKey: ['registrations', getCurrentCompanyId()] });

                <AlertDialogDescription>

                    Tem certeza que deseja {actionText.toLowerCase()} esta matrícula?            setOpen(false);    const queryClient = useQueryClient();}

                    <br /><br />

                    <strong>Estudante:</strong> {registration.users?.name}        },

                </AlertDialogDescription>

            </AlertDialogHeader>        onError: (error: Error) => {    const [open, setOpen] = useState(false);

            <AlertDialogFooter className="!justify-between">

                <AlertDialogCancel disabled={isPending}>            toast.error(error.message);

                    Cancelar

                </AlertDialogCancel>        },    const isLocked = registration.locked;export function ToggleLockRegistrationForm({

                    <AlertDialogAction

                        onClick={() => mutate()}    });

                disabled={isPending}

                className={isLocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}    registrationId, 

                    >

                {isPending ? `${actionText}ando...` : `Confirmar ${actionText}`}    const actionText = isLocked ? 'Destrancar' : 'Trancar';

            </AlertDialogAction>

        </AlertDialogFooter>    const actionDescription = isLocked     const { mutate, isPending } = useMutation({ currentlyLocked, 

            </AlertDialogContent >

        </AlertDialog >        ? 'destrancar esta matrícula. O estudante poderá voltar a acessar normalmente.'

    );

}        : 'trancar esta matrícula. O estudante será impedido de acessar até que seja destrancada.'; mutationFn: () => editRegistration({
    isOpen,



    return(id: registration.id, onClose, 

        <AlertDialog open = { open } onOpenChange = { setOpen } >

            <AlertDialogTrigger asChild>            company_id: registration.company_id,    studentName

                <DropdownMenuItem onSelect={(e) => {

                    e.preventDefault(); monthly_fee_amount: Number(registration.monthly_fee_amount),}: ToggleLockRegistrationFormProps) {

                    setOpen(true);

                }}>            locked: !isLocked, // Toggle do estado atual    const [isLoading, setIsLoading] = useState(false);

                {isLocked ? (

                    <Unlock className="h-4 w-4 mr-2" />            completed: registration.completed || false,    const queryClient = useQueryClient();

                ) : (

                <Lock className="h-4 w-4 mr-2" />        }),

                    )}

                {actionText} Matrícula        onSuccess: (res) => {    const toggleLockMutation = useMutation({

                </DropdownMenuItem>

            </AlertDialogTrigger> toast.success(res.message); mutationFn: () => editRegistration({

            < AlertDialogContent >

                <AlertDialogHeader>            queryClient.invalidateQueries({ queryKey: ['registrations', getCurrentCompanyId()] });            id: registrationId,

                    <AlertDialogTitle>{actionText} Matrícula</AlertDialogTitle>

                    <AlertDialogDescription>            setOpen(false);            company_id: getCurrentCompanyId(),

                        Tem certeza que deseja {actionDescription}

                        <br /><br />        },            locked: !currentlyLocked,

                        <strong>Estudante:</strong> {registration.users?.name}

                    </AlertDialogDescription>        onError: (error: Error) => {            monthly_fee_amount: 0, // Valor obrigatório mas será ignorado no backend

                </AlertDialogHeader>

                <AlertDialogFooter className="!justify-between">            toast.error(error.message);            completed: false, // Valor obrigatório

                    <AlertDialogCancel disabled={isPending}>

                        Cancelar        },        }),

                    </AlertDialogCancel>

                    <AlertDialogAction    });        onSuccess: () => {

                        onClick={() => mutate()}

                        disabled={isPending}            // Usar toast nativo do browser por enquanto

                        className={isLocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}

                    >    const actionText = isLocked ? 'Destrancar' : 'Trancar';            if (currentlyLocked) {

                        {isPending ? `${actionText}ando...` : `Confirmar ${actionText}`}

                    </AlertDialogAction>    const actionDescription = isLocked                 alert(`A matrícula de ${studentName || 'estudante'} foi desbloqueada com sucesso.`);

                </AlertDialogFooter >

            </AlertDialogContent >        ? 'destrancar esta matrícula. O estudante poderá voltar a acessar normalmente.'            } else {

        </AlertDialog >

    );        : 'trancar esta matrícula. O estudante será impedido de acessar até que seja destrancada.'; alert(`A matrícula de ${studentName || 'estudante'} foi bloqueada com sucesso.`);

}
            }

return (queryClient.invalidateQueries({ queryKey: ['registrations'] });

<AlertDialog open={open} onOpenChange={setOpen}>            onClose();

    <AlertDialogTrigger asChild>        },

        <DropdownMenuItem onSelect={(e) => {
            onError: (error: unknown) => {

                e.preventDefault(); const errorMessage = (error as any)?.response?.data?.message || 'Ocorreu um erro inesperado.';

                setOpen(true); alert(`Erro: ${errorMessage}`);

            }
        }>        },

            {isLocked ? (onSettled: () => {

                <Unlock className = "h-4 w-4 mr-2" />            setIsLoading(false);

                    ) : (        },

            <Lock className="h-4 w-4 mr-2" />    });

                    )}

            {actionText} Matrícula    const handleSubmit = () => {

                </DropdownMenuItem>        setIsLoading(true);

    </AlertDialogTrigger>        toggleLockMutation.mutate();

    <AlertDialogContent>    };

        <AlertDialogHeader>

            <AlertDialogTitle>{actionText} Matrícula</AlertDialogTitle>    const isUnlocking = currentlyLocked;

            <AlertDialogDescription>    const Icon = isUnlocking ? Unlock : Lock;

                Tem certeza que deseja {actionDescription}    const action = isUnlocking ? 'desbloquear' : 'bloquear';

                <br /><br />    const actionTitle = isUnlocking ? 'Desbloquear' : 'Bloquear';

                <strong>Estudante:</strong> {registration.users?.name}    const actionDescription = isUnlocking

            </AlertDialogDescription>        ? 'Esta ação permitirá o estudante acessar o sistema novamente.'

        </AlertDialogHeader>        : 'Esta ação impedirá o estudante de acessar o sistema.';

        <AlertDialogFooter className="!justify-between">

            <AlertDialogCancel disabled={isPending}>    return (

                Cancelar        <Dialog open={isOpen} onOpenChange={onClose}>

            </AlertDialogCancel>            <DialogContent>

                <AlertDialogAction                <DialogHeader>

                    onClick={() => mutate()}                    <DialogTitle className="flex items-center gap-2">

                    disabled={isPending}                        <Icon className={`h-5 w-5 ${isUnlocking ? 'text-green-600' : 'text-destructive'}`} />

                    className={isLocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}                        {actionTitle} Matrícula

                    >                    </DialogTitle>

                {isPending ? `${actionText}ando...` : `Confirmar ${actionText}`}                    <DialogDescription>

                </AlertDialogAction>                        Tem certeza que deseja {action} a matrícula de <strong>{studentName}</strong>?

        </AlertDialogFooter>                        <br />

    </AlertDialogContent>                        {actionDescription}

</AlertDialog>                    </DialogDescription >

    );                </DialogHeader >

}                <DialogFooter>
    <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancelar
    </Button>
    <Button
        variant={isUnlocking ? "default" : "destructive"}
        onClick={handleSubmit}
        disabled={isLoading}
        className={isUnlocking ? "bg-green-600 hover:bg-green-700" : ""}
    >
        {isLoading ? `${actionTitle.slice(0, -2)}ando...` : `${actionTitle} Matrícula`}
    </Button>
</DialogFooter>
            </DialogContent >
        </Dialog >
    );
}