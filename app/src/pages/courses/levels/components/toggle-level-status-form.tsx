import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, buttonVariants } from '@/components/ui/button';
import { deactivateLevel } from '@/services/levels';
import type { DeactivateLevelFormData } from '@idiomax/http-schemas/levels/deactivate-level';
import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Power, PowerOff, Loader } from 'lucide-react';

interface ToggleLevelStatusFormProps {
    levelId: string;
    levelName: string;
    isActive: boolean;
    course: GetCourseByIdResponse;
}

export function ToggleLevelStatusForm({ levelId, levelName, isActive, course }: ToggleLevelStatusFormProps) {
    const queryClient = useQueryClient();

    const { mutate: toggleStatus, isPending } = useMutation({
        mutationFn: async () => {
            const levelData: DeactivateLevelFormData = { active: !isActive };
            const response = await deactivateLevel(levelId, levelData);
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['levels', course.id] });
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Erro ao alterar status do level');
        }
    });

    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger
                        asChild
                        disabled={isPending}
                        className={isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                        <Button variant={"outline"} size="icon">
                            {isPending ? (
                                <Loader className="size-4 animate-spin" />
                            ) : isActive ? (
                                <PowerOff className="size-4" />
                            ) : (
                                <Power className="size-4" />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="mb-3">
                    {isActive ? `Desativar nível "${levelName}"` : `Ativar nível "${levelName}"`}
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <div className="py-4">
                    <h3 className="text-lg font-medium">
                        {isActive ? 'Desativar Nível' : 'Ativar Nível'}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Tem certeza que deseja {isActive ? 'desativar' : 'ativar'} o nível "<strong>{levelName}</strong>"?
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