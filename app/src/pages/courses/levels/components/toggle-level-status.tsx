import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deactivateLevel } from '@/services/levels';
import type { DeactivateLevelFormData } from '@idiomax/http-schemas/levels/deactivate-level';
import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';

export function useToggleLevelStatus({ course }: { course: GetCourseByIdResponse }) {
    const queryClient = useQueryClient();

    // Mutation para ativar/desativar level
    const { mutate: toggleLevelStatus, isPending: isToggling } = useMutation({
        mutationFn: async (data: { id: string; active: boolean }) => {
            const levelData: DeactivateLevelFormData = { active: data.active };
            const response = await deactivateLevel(data.id, levelData);
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

    return {
        toggleLevelStatus,
        isToggling
    };
}