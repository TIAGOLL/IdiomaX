import { useSearchParams } from "react-router";
import { MyCompanyProfilePage } from "./profile";
import { MyCompanySettingsPage } from "./settings";
import { Can } from '@/lib/Can';


export function FinanceDashboard() {

    const [searchParams] = useSearchParams();

    return (
        <div className="container mx-auto p-6">
            {searchParams.get('tab') === 'profile' && (
                <Can I="get" a="Company">
                    <MyCompanyProfilePage />
                </Can>
            )}

            {searchParams.get('tab') === 'settings' && (
                <Can I="manage" a="all">
                    <MyCompanySettingsPage />
                </Can>
            )}
        </div>
    );
}
