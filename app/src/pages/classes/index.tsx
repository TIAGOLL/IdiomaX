import { useSearchParams } from "react-router";
import { ClassesTablePage } from "./classes-table";
import { CreateClassPage } from "./create-class";
import { EditClassPage } from "./edit-class";
import { Can } from '@/lib/Can';

export function ClassesPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const classId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can I="create" a="Class">
                    <CreateClassPage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can I="get" a="Class">
                    <ClassesTablePage />
                </Can>
            )}

            {activeTab === 'edit' && classId && (
                <Can I="update" a="Class">
                    <EditClassPage classId={classId} />
                </Can>
            )}
        </div>
    );
}
