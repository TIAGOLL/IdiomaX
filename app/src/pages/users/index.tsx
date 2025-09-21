import { useSearchParams } from 'react-router';
import { CreateUser } from './components/create-user';
import { UsersTable } from './components/users-table';

export default function UsersPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'create';

    return (
        <div className="container mx-auto px-6">

            <div className="mt-6">
                {activeTab === 'create' && <CreateUser />}
                {(activeTab === 'list' || !['create', 'list'].includes(activeTab)) && <UsersTable />}
            </div>
        </div>
    );
}