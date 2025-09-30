import type { GetCourseByIdResponseType } from '@idiomax/validation-schemas/courses/get-course-by-id';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyId } from "@/lib/company-utils";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCourse } from "@/services/courses/delete-course";

export function DeleteCourseForm({ course }: { course: GetCourseByIdResponseType }) {

    const queryClient = useQueryClient();
    const [, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteCourse({
            course_id: course.id,
            company_id: getCurrentCompanyId()
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['course', course.id] });
            setSearchParams({ tab: 'list' });
            setOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="w-full"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Curso
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Curso</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir o curso <strong>{course.name}</strong>?
                        Esta ação não pode ser desfeita e todos os dados do curso serão permanentemente removidos.
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