import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { getLessonById } from '@/services/lessons/get-lesson-by-id';
import { useNavigate } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { EditLessonForm } from './components/edit-lesson-form';
import { PresenceListForm } from './components/presence-list-form';

export function EditLessonPage({ lessonId }: { lessonId: string }) {
    const navigate = useNavigate();

    const { data: lesson, isPending: isLoadingLesson } = useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => getLessonById({
            lesson_id: lessonId,
            company_id: getCurrentCompanyId()
        }),
        enabled: !!lessonId,
    });

    if (isLoadingLesson) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Aula não encontrada.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('?tab=list')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <CardTitle className="flex gap-2 items-center">
                            <Calendar className="w-5 h-5" />
                            Editar Aula
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Edite os dados da aula e gerencie a lista de presença dos alunos.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EditLessonForm lesson={lesson} />
                <PresenceListForm lesson={lesson} />
            </div>
        </div>
    );
}