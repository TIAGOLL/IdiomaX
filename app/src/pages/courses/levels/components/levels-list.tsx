import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoaderIcon, Power, PowerOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getLevelsByCourse } from '@/services/levels';
import type { Level } from '@idiomax/http-schemas/levels/get-levels';
import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';
import { EditLevelForm } from './edit-level-form';
import { DeleteLevelForm } from './delete-level-form';
import { useToggleLevelStatus } from './toggle-level-status';
import { CreateDisciplineForm } from './disciplines/create-discipline-form';
import { EditDisciplineForm } from './disciplines/edit-discipline-form';
import { DeleteDisciplineForm } from './disciplines/delete-discipline-form';
import { useToggleDisciplineStatus } from './disciplines/toggle-discipline-status';

export function LevelsList({ course }: { course: GetCourseByIdResponse }) {
    const { toggleLevelStatus, isToggling } = useToggleLevelStatus({ course });
    const { toggleDisciplineStatus, isToggling: isTogglingDiscipline } = useToggleDisciplineStatus({
        courseId: course.id
    });

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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Levels</TableHead>
                        <TableHead>Disciplinas</TableHead>
                        <TableHead className="w-[200px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {levels.map((level: Level) => {
                        const disciplines = level.disciplines || [];
                        const rowsToRender = Math.max(disciplines.length + 1, 1); // +1 para linha de adicionar, min 1

                        return (
                            <React.Fragment key={level.id}>
                                {/* Primeira linha de cada nível */}
                                <TableRow>
                                    {/* Coluna 1: Level Info (rowspan para todas as disciplinas + linha de adicionar) */}
                                    <TableCell
                                        rowSpan={rowsToRender}
                                        className="bg-muted/20 align-top p-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="space-y-2">
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
                                            <div className="flex flex-col gap-2">
                                                <div className="text-xs font-medium text-muted-foreground mb-1">
                                                    Ações do Nível:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleLevelStatus({ id: level.id, active: !level.active })}
                                                        disabled={isToggling}
                                                        className={level.active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                                        title={level.active ? "Desativar" : "Ativar"}
                                                    >
                                                        {level.active ? <PowerOff className="size-3" /> : <Power className="size-3" />}
                                                    </Button>
                                                    <EditLevelForm course={course} level={level} />
                                                    <DeleteLevelForm course={course} level={level} />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Se há disciplinas, mostra a primeira */}
                                    {disciplines.length > 0 ? (
                                        <>
                                            <TableCell className="p-3">
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
                                                            {disciplines[0].active ? 'Ativa' : 'Inativa'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-3">
                                                <div className="grid grid-cols-1 gap-2">
                                                    <DeleteDisciplineForm
                                                        disciplineId={disciplines[0].id}
                                                        disciplineName={disciplines[0].name}
                                                        courseId={course.id}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleDisciplineStatus({
                                                            id: disciplines[0].id,
                                                            active: !disciplines[0].active
                                                        })}
                                                        disabled={isTogglingDiscipline}
                                                        className={disciplines[0].active
                                                            ? "text-orange-600 hover:text-orange-700 h-8 text-xs"
                                                            : "text-green-600 hover:text-green-700 h-8 text-xs"
                                                        }
                                                    >
                                                        {disciplines[0].active ? (
                                                            <>
                                                                <PowerOff className="size-3 mr-1" />
                                                                Desativar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Power className="size-3 mr-1" />
                                                                Ativar
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        // Se não há disciplinas, mostra área de adicionar
                                        <>
                                            <TableCell className="bg-blue-50/30 p-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-blue-600 w-16">Nova:</span>
                                                    <div className="flex-1">
                                                        <CreateDisciplineForm
                                                            levelId={level.id}
                                                            levelName={level.name}
                                                            courseId={course.id}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="bg-blue-50/30 p-3">
                                                <div className="text-xs text-muted-foreground text-center">
                                                    -
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>

                                {/* Disciplinas restantes (a partir da segunda) */}
                                {disciplines.slice(1).map((discipline) => (
                                    <TableRow key={discipline.id}>
                                        <TableCell className="p-3">
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
                                                        {discipline.active ? 'Ativa' : 'Inativa'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-3">
                                            <div className="grid grid-cols-1 gap-2">
                                                <DeleteDisciplineForm
                                                    disciplineId={discipline.id}
                                                    disciplineName={discipline.name}
                                                    courseId={course.id}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleDisciplineStatus({
                                                        id: discipline.id,
                                                        active: !discipline.active
                                                    })}
                                                    disabled={isTogglingDiscipline}
                                                    className={discipline.active
                                                        ? "text-orange-600 hover:text-orange-700 h-8 text-xs"
                                                        : "text-green-600 hover:text-green-700 h-8 text-xs"
                                                    }
                                                >
                                                    {discipline.active ? (
                                                        <>
                                                            <PowerOff className="size-3 mr-1" />
                                                            Desativar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Power className="size-3 mr-1" />
                                                            Ativar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* Linha para adicionar nova disciplina (apenas se há disciplinas existentes) */}
                                {disciplines.length > 0 && (
                                    <TableRow>
                                        <TableCell className="bg-blue-50/30 p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-blue-600 w-16">Nova:</span>
                                                <div className="flex-1">
                                                    <CreateDisciplineForm
                                                        levelId={level.id}
                                                        levelName={level.name}
                                                        courseId={course.id}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="bg-blue-50/30 p-3">
                                            <div className="text-xs text-muted-foreground text-center">
                                                -
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}