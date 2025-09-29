import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoaderIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getLevelsByCourse } from '@/services/levels';
import type { Level } from '@idiomax/validation-schemas/levels/get-levels';
import type { GetCourseByIdResponse } from '@idiomax/validation-schemas/courses/get-course-by-id';
import { EditLevelForm } from './edit-level-form';
import { DeleteLevelForm } from './delete-level-form';
import { ToggleLevelStatusForm } from './toggle-level-status-form';
import { CreateDisciplineForm } from './disciplines/create-discipline-form';
import { EditDisciplineForm } from './disciplines/edit-discipline-form';
import { DeleteDisciplineForm } from './disciplines/delete-discipline-form';
import { ToggleDisciplineStatusForm } from './disciplines/toggle-discipline-status-form';

export function LevelsList({ course }: { course: GetCourseByIdResponse }) {
    // Query para buscar levels do curso
    const { data: levels = [], isLoading: isLoadingLevels } = useQuery({
        queryKey: ['levels', course.id],
        queryFn: () => getLevelsByCourse({ course_id: course.id }),
        enabled: !!course.id,
    });

    if (isLoadingLevels) {
        return (
            <div className="flex justify-center items-center py-8">
                <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!levels || levels.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    Nenhum nível cadastrado para este curso.
                </p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table className="mb-4">
                <TableHeader >
                    <TableRow className='border-black/50 dark:border-white/50'>
                        <TableHead className="!text-center w-[250px] border-black/50 dark:border-white/50 border-1">Levels</TableHead>
                        <TableHead className="!text-center border-black/50 dark:border-white/50 border-1">Disciplinas</TableHead>
                        <TableHead className="!text-center w-[200px] border-black/50 dark:border-white/50 border-1">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='border-black/50 dark:border-white/50 border-1'>
                    {levels.map((level: Level) => {
                        const disciplines = level.disciplines || [];

                        return (
                            <React.Fragment key={level.id}>
                                {/* Primeira linha de cada nível */}
                                <TableRow className='border-black/50 dark:border-white/50 border-1'>
                                    {/* Coluna 1: Level Info (rowspan para todas as disciplinas) */}
                                    <TableCell
                                        rowSpan={disciplines.length === 0 ? 1 : disciplines.length}
                                        className="p-4 border-1 border-black/50 dark:border-white/50 bg-muted/20 align-middle"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2 items-center justify-center flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-lg">{level.name}</h4>
                                                    <Badge variant={level.active ? 'default' : 'secondary'} className="text-xs">
                                                        {level.active ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Nível {level.level}
                                                </p>
                                                <div className="text-xs text-muted-foreground">
                                                    {disciplines.length} disciplina(s)
                                                </div>
                                            </div>

                                            {/* Ações do Level */}
                                            <div className="flex flex-col gap-2 items-center justify-center">
                                                <div className="text-xs font-medium text-muted-foreground mb-1">
                                                    Ações do Nível:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    <ToggleLevelStatusForm
                                                        levelId={level.id}
                                                        levelName={level.name}
                                                        isActive={level.active}
                                                        course={course}
                                                    />
                                                    <EditLevelForm course={course} level={level} />
                                                    <DeleteLevelForm course={course} level={level} />
                                                    <CreateDisciplineForm
                                                        levelId={level.id}
                                                        levelName={level.name}
                                                        courseId={course.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Colunas 2 e 3: Primeira disciplina ou mensagem vazia */}
                                    {disciplines.length === 0 ? (
                                        <>
                                            <TableCell className="p-3 border-1 border-black/50 dark:border-white/50">
                                                <div className="text-center text-muted-foreground">
                                                    Nenhuma disciplina cadastrada.
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-1 border-black/50 dark:border-white/50">
                                                <div className="items-center justify-center flex flex-row gap-3">
                                                    {/* Vazio para quando não há disciplinas */}
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="p-3 border-1 border-black/50 dark:border-white/50">
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground w-16">Nome:</span>
                                                        <div className="flex-1">
                                                            <EditDisciplineForm
                                                                disciplineId={disciplines[0].id}
                                                                currentName={disciplines[0].name}
                                                                courseId={course.id}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground w-16">Status:</span>
                                                        <Badge
                                                            variant={disciplines[0].active ? 'default' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {disciplines[0].active ? 'Ativo' : 'Inativo'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-1 border-black/50 dark:border-white/50">
                                                <div className="items-center justify-center flex flex-row gap-3">
                                                    <ToggleDisciplineStatusForm
                                                        disciplineId={disciplines[0].id}
                                                        disciplineName={disciplines[0].name}
                                                        isActive={disciplines[0].active}
                                                        courseId={course.id}
                                                    />
                                                    <DeleteDisciplineForm
                                                        disciplineId={disciplines[0].id}
                                                        disciplineName={disciplines[0].name}
                                                        courseId={course.id}
                                                    />
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>

                                {/* Disciplinas restantes (a partir da segunda) */}
                                {disciplines.slice(1).map((discipline) => (
                                    <TableRow key={discipline.id} className='border-black/50 dark:border-white/50 border-1'>
                                        <TableCell className="p-3 border-1 border-black/50 dark:border-white/50">
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground w-16">Nome:</span>
                                                    <div className="flex-1">
                                                        <EditDisciplineForm
                                                            disciplineId={discipline.id}
                                                            currentName={discipline.name}
                                                            courseId={course.id}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground w-16">Status:</span>
                                                    <Badge
                                                        variant={discipline.active ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {discipline.active ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-1 border-black/50 dark:border-white/50">
                                            <div className="items-center justify-center flex flex-row gap-3">
                                                <ToggleDisciplineStatusForm
                                                    disciplineId={discipline.id}
                                                    disciplineName={discipline.name}
                                                    isActive={discipline.active}
                                                    courseId={course.id}
                                                />
                                                <DeleteDisciplineForm
                                                    disciplineId={discipline.id}
                                                    disciplineName={discipline.name}
                                                    courseId={course.id}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}