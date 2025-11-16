import { AdminDashboard } from "./admin";
import { StudentDashboard } from "./student";
import { TeacherDashboard } from "./teacher";
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
            {currentRole === 'STUDENT' && (
                <StudentDashboard />
            )}
            {currentRole === 'TEACHER' && (
                <TeacherDashboard />
            )}
        </div>
    );
}
