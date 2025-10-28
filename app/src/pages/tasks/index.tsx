import { useSearchParams } from "react-router";
import { Can } from '@/lib/Can';
import { TasksTablePage } from './task-table';
import { CreateTaskPage } from './create-task';
import { EditTaskPage } from './edit-task';

export function TasksPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const taskId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can I="create" a="Task">
                    <CreateTaskPage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can I="get" a="Task">
                    <TasksTablePage />
                </Can>
            )}

            {activeTab === 'edit' && taskId && (
                <Can I="update" a="Task">
                    <EditTaskPage taskId={taskId} />
                </Can>
            )}
        </div>
    );
}
