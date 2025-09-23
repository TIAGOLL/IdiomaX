import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';
import z from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { DeactivateCourseFormSchema } from '@idiomax/http-schemas/courses/deactivate-course';
import { BookCheck, BookX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deactivateCourse } from '@/services/courses/deactivate-course';

type DeactivateCourseFormSchema = z.infer<typeof DeactivateCourseFormSchema>;

export function DeactivateCourseForm({ course }: { course: GetCourseByIdResponse }) {

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: DeactivateCourseFormSchema) => deactivateCourse({
            course_id: course.id,
            company_id: getCurrentCompanyId(),
            ...data
        }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['course', course.id] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const { handleSubmit, setValue } = useForm({
        resolver: zodResolver(DeactivateCourseFormSchema),
    })

    useEffect(() => {
        setValue('active', !course.active);
    }, [setValue, course]);

    return (
        <>
            <Button variant="outline" className="w-full" onClick={handleSubmit((data) => mutate(data))} disabled={isPending}>
                {course.active ? (
                    <>
                        <BookX className="size-4 mr-2" />
                        {isPending ? 'Desativando...' : 'Desativar Curso'}
                    </>
                ) : (
                    <>
                        <BookCheck className="size-4 mr-2" />
                        {isPending ? 'Ativando...' : 'Ativar Curso'}
                    </>
                )}
            </Button>
        </>
    )
}