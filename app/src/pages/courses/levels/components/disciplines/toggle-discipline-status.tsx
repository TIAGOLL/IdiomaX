import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleDisciplineStatus, type ToggleDisciplineStatusRequest } from '@/services/disciplines';
import { toast } from 'sonner';

interface UseToggleDisciplineStatusProps {
    courseId: string;
}

export function useToggleDisciplineStatus({ courseId }: UseToggleDisciplineStatusProps) {
    const queryClient = useQueryClient();

    const { mutate: toggleStatus, isPending: isToggling } = useMutation({
        mutationFn: (data: ToggleDisciplineStatusRequest) => toggleDisciplineStatus(data),
        onSuccess: (_, variables) => {
            const action = variables.active ? 'ativada' : 'desativada';
            toast.success(`Disciplina ${action} com sucesso!`);
            queryClient.invalidateQueries({ queryKey: ['levels', courseId] });
        },
        onError: () => {
            toast.error('Erro ao alterar status da disciplina');
        },
    });

    return {
        toggleDisciplineStatus: toggleStatus,
        isToggling,
    };
}