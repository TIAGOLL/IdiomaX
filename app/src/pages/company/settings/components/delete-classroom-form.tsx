import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteClassroom, } from "@/services/classrooms";
import { getCurrentCompanyId } from "@/lib/company-utils";
import type { GetClassroomsResponseType } from "@idiomax/validation-schemas/classrooms/get-classrooms";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DeleteClassroomForm({ classroom }: { classroom: GetClassroomsResponseType[number] }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteClassroom({
            id: classroom.id,
            company_id: getCurrentCompanyId()
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-3">
                    Excluir sala "{classroom.number}"
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Sala de Aula</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a sala <strong>{classroom.number}</strong>
                        {classroom.block && <> do bloco <strong>{classroom.block}</strong></>}?
                        Esta ação não pode ser desfeita e todos os dados da sala serão permanentemente removidos.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
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
    )
}