import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, buttonVariants } from '@/components/ui/button';
import { toggleDisciplineStatus } from '@/services/disciplines';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Power, PowerOff, Loader } from 'lucide-react';

interface ToggleDisciplineStatusFormProps {
    disciplineId: string;
    disciplineName: string;
    isActive: boolean;
    courseId: string;
}

export function ToggleDisciplineStatusForm({ disciplineId, disciplineName, isActive, courseId }: ToggleDisciplineStatusFormProps) {
    const queryClient = useQueryClient();

    const { mutate: toggleStatus, isPending } = useMutation({
        mutationFn: () => toggleDisciplineStatus(disciplineId, { active: !isActive }),
        onSuccess: () => {
            const action = !isActive ? 'ativada' : 'desativada';
            toast.success(`Disciplina "${disciplineName}" ${action} com sucesso!`);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
        },
        onError: () => {
            toast.error('Erro ao alterar status da disciplina');
        },
    });

    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isPending}
                            className={isActive
                                ? "text-orange-600 hover:text-orange-700"
                                : "text-green-600 hover:text-green-700"
                            }
                        >
                            {isActive && <PowerOff />}
                            {!isActive && <Power />}
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className=' mb-3'>
                    {isActive && <>Desativar disciplina</>}
                    {!isActive && <>Ativar disciplina</>}
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <div className="py-4">
                    <h3 className="text-lg font-medium">
                        {isActive ? 'Desativar Disciplina' : 'Ativar Disciplina'}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Tem certeza que deseja {isActive ? 'desativar' : 'ativar'} a disciplina "<strong>{disciplineName}</strong>"?
                    </p>
                </div>
                <AlertDialogFooter className='!justify-between'>
                    <AlertDialogCancel>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => toggleStatus()}
                        disabled={isPending}
                        className={buttonVariants({ variant: isActive ? 'destructive' : 'default' })}
                    >
                        {isActive ? 'Desativar' : 'Ativar'}
                        {!isPending && isActive && <PowerOff className='ml-2 size-4' />}
                        {!isPending && !isActive && <Power className='ml-2 size-4' />}
                        {isPending && <Loader className='animate-spin ml-2 size-4' />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}