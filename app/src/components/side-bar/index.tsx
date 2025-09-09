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
import { getCompanyById } from "@/services/companies/get-company-by-id"
import { getSessionProfile } from "@/lib/get-sub-token"
import { useQuery } from "@tanstack/react-query"

export function Sidebar({ ...props }: React.ComponentProps<typeof SideBarComponent>) {
    const { data: companyProfile, } = useQuery({
        queryKey: ['company', getSessionProfile().profile.company],
        queryFn: () => getCompanyById({ companyId: getSessionProfile().profile.company }),
    });

    return (
        <SideBarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <Avatar>
                    <AvatarImage src={companyProfile?.logo_16x16} />
                    <AvatarFallback>{companyProfile?.name}</AvatarFallback>
                </Avatar>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navData().navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={navData().navUser} />
            </SidebarFooter>
            <SidebarRail />
        </SideBarComponent>
    )
}

function navData() {
    const sessionProfile = getSessionProfile()

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
            name: sessionProfile?.profile.name,
            email: sessionProfile?.profile.email,
        },
    }
}
