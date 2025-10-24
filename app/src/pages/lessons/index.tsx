import { useSearchParams } from 'react-router';
import { LessonsTablePage } from './lessons-table';
import { CreateLessonPage } from './create-lesson';
import { EditLessonPage } from './edit-lesson';
import { Can } from '@/lib/Can';

export default function LessonsPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const lessonId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can I="create" a="Lesson">
                    <CreateLessonPage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can I="get" a="Lesson">
                    <LessonsTablePage />
                </Can>
            )}

            {activeTab === 'edit' && lessonId && (
                <Can I="update" a="Lesson">
                    <EditLessonPage lessonId={lessonId} />
                </Can>
            )}
        </div>
    );
}