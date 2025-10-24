import { useSearchParams } from 'react-router';
import { CreateUserPage } from './create-user';
import { UsersTablePage } from './users-table';
import { EditUserPage } from './edit-user';
import { Can } from '@/lib/Can';

export default function UsersPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const userId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can I="manage" a="all">
                    <CreateUserPage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can I="get" a="User">
                    <UsersTablePage />
                </Can>
            )}

            {activeTab === 'edit' && userId && (
                <Can I="update" a="User">
                    <EditUserPage />
                </Can>
            )}
        </div>
    );
}