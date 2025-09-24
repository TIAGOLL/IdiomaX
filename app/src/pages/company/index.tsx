import { useSearchParams } from "react-router";
import { MyCompanyProfilePage } from "./profile";
import { MyCompanySettingsPage } from "./settings";


export function FinanceDashboard() {

    const [searchParams] = useSearchParams();

    return (
        <div className="container mx-auto p-6">
            {searchParams.get('tab') === 'profile' && <MyCompanyProfilePage />}
            {searchParams.get('tab') === 'settings' && <MyCompanySettingsPage />}
        </div>
    );
}
