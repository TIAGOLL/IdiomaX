import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';


export function SideBar() {
    const { logout } = useAuth();
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <Collapsible className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        Help
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent />
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

function getLinks() {
    return [
        { title: "Dashboard", links: [{ name: "Dashboard", to: "/admin/dashboard" }] },
        {
            title: "Alunos",
            links: [
                { name: "Ver alunos", to: "/admin/students?tab=all" },
                { name: "Cadastrar aluno", to: "/admin/students?tab=create" },
            ],
        },
        {
            title: "Cursos",
            links: [
                { name: "Ver cursos", to: "/admin/courses?tab=all" },
                { name: "Cadastrar curso", to: "/admin/courses?tab=create" },
                { name: "Ver matrículas", to: "/admin/registrations?tab=all" },
                { name: "Matricular aluno", to: "/admin/registrations?tab=create" },
            ],
        },
        {
            title: "Turmas",
            links: [
                { name: "Ver todas", to: "/admin/classrooms?tab=all" },
                { name: "Cadastrar turma", to: "/admin/classrooms?tab=create" },
            ],
        },
        {
            title: "Funcionários",
            links: [
                { name: "Ver todos", to: "/admin/professionals?tab=all" },
                { name: "Cadastrar funcinário", to: "/admin/professionals?tab=create" },
            ],
        },
    ];
}
