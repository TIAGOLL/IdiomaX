import { useSearchParams } from 'react-router';
import { CreateUserPage } from './create-user';
import { UsersTablePage } from './users-table';
import { EditUserPage } from './edit-user';

export default function UsersPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const userId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && <CreateUserPage />}
            {activeTab === 'list' && <UsersTablePage />}
            {activeTab === 'edit' && userId && <EditUserPage />}
        </div>
    );
}