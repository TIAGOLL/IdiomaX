import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Loader2, Trash2 } from 'lucide-react';
import { deleteDiscipline, } from '@/services/disciplines';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DeleteDisciplineFormProps {
    disciplineId: string;
    disciplineName: string;
    courseId: string;
}

export function DeleteDisciplineForm({ disciplineId, disciplineName, courseId }: DeleteDisciplineFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteDiscipline({
            id: disciplineId,
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
            setIsOpen(false);
        },
        onError: (res) => {
            toast.error(res.message);
        },
    });

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className='flex items-center justify-center'>
                            <Trash2 className="size-5" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className=' mb-3'>
                    Deletar disciplina
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a disciplina "{disciplineName}"?
                        <br />
                        <strong>Esta ação não pode ser desfeita.</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='!justify-between'>
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate()}
                        disabled={isPending}
                        className={buttonVariants({ variant: 'destructive' })}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Excluir Disciplina
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}