import { useSearchParams } from "react-router";
import { ClassTablePage } from "./components/class-table-page";


export function ClassPage() {

    const [searchParams] = useSearchParams();

    return (
        <div className="container mx-auto p-6">
            {searchParams.get('tab') === 'list' && <ClassTablePage />}
            {/* {searchParams.get('tab') === 'edit' && <EditClass />}
            {searchParams.get('tab') === 'create' && <CreateClass />} */}
        </div>
    );
}
