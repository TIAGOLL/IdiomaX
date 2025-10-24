import { AdminDashboard } from "./admin";
import { useSessionContext } from "@/contexts/session-context";
import { Can } from '@/lib/Can';


export function DashboardPage() {
    const { currentRole } = useSessionContext()

    return (
        <div className="flex justify-center items-center sm:w-full">
            {currentRole === 'ADMIN' && (
                <Can I="manage" a="all">
                    <AdminDashboard />
                </Can>
            )}
        </div>
    );
}
