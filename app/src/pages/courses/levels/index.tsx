import { GraduationCap } from 'lucide-react';

import type { GetCourseByIdResponse } from '@idiomax/http-schemas/courses/get-course-by-id';
import { CreateLevelForm } from './components/create-level-form';
import { LevelsList } from './components/levels-list';

export function UpsertLevels({ course }: { course: GetCourseByIdResponse }) {

    return (
        <div className='space-y-6'>
            {/* Header com botão de criar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="size-5" />
                        Níveis e Disciplinas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os níveis e disciplinas do curso: {course.name}
                    </p>
                </div>
                <CreateLevelForm course={course} />
            </div>

            {/* Lista de Níveis */}
            <LevelsList course={course} />
        </div>
    );
}