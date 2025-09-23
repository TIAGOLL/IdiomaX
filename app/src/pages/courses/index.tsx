import { useSearchParams } from 'react-router';
import { CoursesTablePage } from './course-table';
import { CreateCoursePage } from './create-course';
import { EditCoursePage } from './edit-course';

export default function CoursesPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const courseId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && <CreateCoursePage />}
            {activeTab === 'list' && <CoursesTablePage />}
            {activeTab === 'edit' && courseId && <EditCoursePage />}
        </div>
    );
}