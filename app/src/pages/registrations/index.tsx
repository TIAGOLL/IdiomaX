import { useSearchParams } from 'react-router';
import { CreateRegistrationPage } from './create-registration';
import { RegistrationsTablePage } from './registration-table';

export default function RegistrationsPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && <CreateRegistrationPage />}
            {activeTab === 'list' && <RegistrationsTablePage />}
        </div>
    );
}