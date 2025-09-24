import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteDiscipline, type DeleteDisciplineRequest } from '@/services/disciplines';
import { toast } from 'sonner';

interface DeleteDisciplineFormProps {
    disciplineId: string;
    disciplineName: string;
    courseId: string;
}

export function DeleteDisciplineForm({ disciplineId, disciplineName, courseId }: DeleteDisciplineFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: handleDeleteDiscipline, isPending } = useMutation({
        mutationFn: (data: DeleteDisciplineRequest) => deleteDiscipline(data),
        onSuccess: () => {
            toast.success('Disciplina excluída com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setIsOpen(false);
        },
        onError: () => {
            toast.error('Erro ao excluir disciplina');
        },
    });

    const handleConfirmDelete = () => {
        handleDeleteDiscipline({ id: disciplineId });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 h-8 text-xs"
                >
                    <Trash2 className="size-3 mr-1" />
                    Deletar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a disciplina "{disciplineName}"?
                        <br />
                        <strong>Esta ação não pode ser desfeita.</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Excluir Disciplina
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}