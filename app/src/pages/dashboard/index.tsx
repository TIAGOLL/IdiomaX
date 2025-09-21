import { AdminDashboard } from "./admin";
import { useSessionContext } from "@/contexts/session-context";


export function DashboardPage() {
    const { currentRole } = useSessionContext()

    return (
        <div className="flex justify-center items-center sm:w-full">
            {
                currentRole === 'ADMIN' && <AdminDashboard />
            }
        </div>
    );
}
