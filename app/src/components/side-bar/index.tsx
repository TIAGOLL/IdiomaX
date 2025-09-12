import {
    Sidebar as SideBarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { NavMain } from "./components/nav-main"
import { NavUser } from "./components/nav-user"
import { LayoutDashboardIcon } from "lucide-react"
import { type getUserProfileResponse } from './../../services/users/get-user-profile';
import { useAuth } from "@/contexts/auth-context"


export function Sidebar({ ...props }: React.ComponentProps<typeof SideBarComponent>) {

    const { currentUserProfile } = useAuth();

    if (!currentUserProfile) return null;

    return (
        <SideBarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <Avatar>
                    <AvatarImage src={currentUserProfile?.avatar || ""} />
                    <AvatarFallback>{currentUserProfile?.member_on[0]?.company.name}</AvatarFallback>
                </Avatar>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navData(currentUserProfile).navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={navData(currentUserProfile).navUser} />
            </SidebarFooter>
            <SidebarRail />
        </SideBarComponent>
    )
}

function navData(userProfile: getUserProfileResponse) {

    return {
        navMain: [
            { title: "Dashboard", icon: LayoutDashboardIcon, links: [{ name: "Visão geral", to: "/admin/dashboard" }] },
            {
                title: "Alunos",
                icon: LayoutDashboardIcon,
                links: [
                    { name: "Ver alunos", to: "/admin/students?tab=all" },
                    { name: "Cadastrar aluno", to: "/admin/students?tab=create" },
                ],
            },
            {
                title: "Cursos",
                icon: LayoutDashboardIcon,
                links: [
                    { name: "Ver cursos", to: "/admin/courses?tab=all" },
                    { name: "Cadastrar curso", to: "/admin/courses?tab=create" },
                    { name: "Ver matrículas", to: "/admin/registrations?tab=all" },
                    { name: "Matricular aluno", to: "/admin/registrations?tab=create" },
                ],
            },
            {
                title: "Turmas",
                icon: LayoutDashboardIcon,
                links: [
                    { name: "Ver todas", to: "/admin/classrooms?tab=all" },
                    { name: "Cadastrar turma", to: "/admin/classrooms?tab=create" },
                ],
            },
            {
                title: "Funcionários",
                icon: LayoutDashboardIcon,
                links: [
                    { name: "Ver todos", to: "/admin/professionals?tab=all" },
                    { name: "Cadastrar funcinário", to: "/admin/professionals?tab=create" },
                ],
            },
        ],
        navUser: {
            name: userProfile?.name,
            email: userProfile?.email,
        },
    }
}
