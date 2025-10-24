import { useSearchParams } from 'react-router';
import { CoursesTablePage } from './course-table';
import { CreateCoursePage } from './create-course';
import { EditCoursePage } from './edit-course';
import { Can } from '@/lib/Can';

export default function CoursesPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const courseId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can I="create" a="Course">
                    <CreateCoursePage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can I="get" a="Course">
                    <CoursesTablePage />
                </Can>
            )}

            {activeTab === 'edit' && courseId && (
                <Can I="update" a="Course">
                    <EditCoursePage courseId={courseId} />
                </Can>
            )}
        </div>
    );
}