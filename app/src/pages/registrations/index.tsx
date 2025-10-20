import { useSearchParams } from 'react-router';
import { CreateRegistrationPage } from './create-registration';
import { RegistrationsTablePage } from './registration-table';
import { RegistrationsEditPage } from './edit-registration';
import { Can } from '@/lib/Can';

export default function RegistrationsPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const registrationId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {activeTab === 'create' && (
                <Can do="create" on="Registration">
                    <CreateRegistrationPage />
                </Can>
            )}

            {activeTab === 'list' && (
                <Can do="get" on="Registration">
                    <RegistrationsTablePage />
                </Can>
            )}

            {activeTab === 'edit' && registrationId && (
                <Can do="update" on="Registration">
                    <RegistrationsEditPage registrationId={registrationId} />
                </Can>
            )}
        </div>
    );
}