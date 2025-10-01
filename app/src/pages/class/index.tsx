import { useSearchParams } from "react-router";
import { ClassTablePage } from "./components/class-table-page";
// import { CreateClassPage } from "./create-class";
import { EditClassPage } from "./edit-class";

export function ClassPage() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'list';
    const classId = searchParams.get('id');

    return (
        <div className="container mx-auto p-6">
            {/* {activeTab === 'create' && <CreateClassPage />} */}
            {activeTab === 'list' && <ClassTablePage />}
            {activeTab === 'edit' && classId && <EditClassPage classId={classId} />}
        </div>
    );
}
