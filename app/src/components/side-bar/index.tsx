import {
    Sidebar as SideBarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./components/nav-main"
import { NavUser } from "./components/nav-user"
import { LayoutDashboardIcon } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import { CompanySwitcher } from "./components/company-switcher"
import { ModeToggle } from "../ui/mode-toggle"


export function Sidebar({ ...props }: React.ComponentProps<typeof SideBarComponent>) {

    const { userProfile, } = useSession();

    if (!userProfile) return null;

    return (
        <SideBarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <CompanySwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navData().navMain} />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </SideBarComponent>
    )
}

function navData() {

    return {
        navMain: [
            { title: "Dashboard", icon: LayoutDashboardIcon, links: [{ name: "Visão geral", to: "/" }] },
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
    }
}