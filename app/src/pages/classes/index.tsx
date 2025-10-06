import { useSearchParams } from 'react-router';
import { LessonsTablePage } from './lessons-table';
import { CreateLessonPage } from './create-lesson';
import { EditLessonPage } from './edit-lesson';

export default function ClassesPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const lessonId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && <CreateLessonPage />}
            {activeTab === 'list' && <LessonsTablePage />}
            {activeTab === 'edit' && lessonId && <EditLessonPage lessonId={lessonId} />}
        </div>
    );
}