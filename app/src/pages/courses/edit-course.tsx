import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { getCourseById } from '@/services/courses';
import { Badge } from '@/components/ui/badge';
import { EditCourseForm } from './components/edit-course-form';
import { DeactivateCourseForm } from './components/deactivate-course-form';
import { DeleteCourseForm } from './components/delete-course-form';
import { UpsertLevels } from './components/upsert-levels-form';

export function EditCoursePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const courseId = searchParams.get('id') || '';

    // Buscar dados do curso
    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById({ course_id: courseId }),
        enabled: !!courseId
    });

    // Se está carregando ou há erro
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando dados do curso...</span>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Erro ao carregar dados do curso</p>
                    <Button variant="outline" onClick={() => setSearchParams({ tab: 'list' })}>
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className='flex justify-between flex-row pr-6'>
                <CardHeader className='w-full'>
                    <CardTitle className="flex gap-2">
                        <BookOpen className="size-5" />
                        Editar Curso
                        <Badge variant={course.active ? 'default' : 'destructive'}>
                            {course.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Edite as informações do curso: {course.name}
                    </CardDescription>
                </CardHeader>
                <Button variant="outline" size="sm" onClick={() => setSearchParams({ tab: 'list' })}>
                    <X className="h-4 w-4" />
                </Button>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm course={course} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar com informações adicionais */}
                <div className="space-y-4">
                    {/* Status do curso */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status do Curso</CardTitle>
                            <CardDescription>
                                Informações sobre o estado atual do curso.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={course.active ? 'default' : 'destructive'}>
                                        {course.active ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Criado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(course.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Atualizado em:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(course.updated_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ações do curso */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações do Curso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Ativar/Desativar Curso */}
                            <DeactivateCourseForm course={course} />
                            <Separator />
                            {/* Excluir Curso */}
                            <DeleteCourseForm course={course} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Níveis e Disciplinas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UpsertLevels course={course} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
