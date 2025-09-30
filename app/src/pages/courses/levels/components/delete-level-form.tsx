import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LoaderIcon, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteLevel } from '@/services/levels';
import type { GetCourseByIdResponseType } from '@idiomax/validation-schemas/courses/get-course-by-id';
import type { Level } from '@idiomax/validation-schemas/levels/get-levels';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getCurrentCompanyId } from '@/lib/company-utils';

export function DeleteLevelForm({ course, level }: { course: GetCourseByIdResponseType; level: Level }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    // Mutation para deletar level
    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const response = await deleteLevel({
                company_id: getCurrentCompanyId(),
                level_id: level.id
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', course.id] });
            setOpen(false);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao deletar level');
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-3">
                    Excluir nível "{level.name}"
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza de que deseja excluir o nível "{level.name}"?
                        Esta ação não pode ser desfeita e todas as disciplinas associadas também serão removidas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='!justify-between'>
                    <AlertDialogCancel>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate()}>
                        {
                            isDeleting ? (
                                <>
                                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent >
        </AlertDialog >
    );
}