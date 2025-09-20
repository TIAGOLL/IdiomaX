import { LayoutDashboardIcon } from "lucide-react"

export function getNavigationData() {
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
                    { name: "Cadastrar funcionário", to: "/admin/professionals?tab=create" },
                ],
            },
        ],
    }
}

// Função para converter dados da navegação para formato do breadcrumb
export function getBreadcrumbConfig() {
    const navData = getNavigationData();

    const breadcrumbConfig: Record<string, { label: string; items: { label: string; href: string }[] }> = {};

    // Processar cada item da navegação
    navData.navMain.forEach(section => {
        const sectionKey = section.title.toLowerCase();

        // Mapear nomes de seções para chaves de URL
        let urlKey = sectionKey;
        if (sectionKey === 'alunos') urlKey = 'students';
        else if (sectionKey === 'funcionários') urlKey = 'professionals';
        else if (sectionKey === 'dashboard') urlKey = 'admin';

        breadcrumbConfig[urlKey] = {
            label: section.title,
            items: section.links.map(link => ({
                label: link.name,
                href: link.to
            }))
        };
    });

    // Adicionar mapeamentos adicionais para sub-rotas
    breadcrumbConfig.admin = {
        label: 'Admin',
        items: [
            { label: 'Dashboard', href: '/' },
            { label: 'Ver alunos', href: '/admin/students?tab=all' },
            { label: 'Cadastrar aluno', href: '/admin/students?tab=create' },
            { label: 'Ver cursos', href: '/admin/courses?tab=all' },
            { label: 'Ver funcionários', href: '/admin/professionals?tab=all' },
        ]
    };

    // Alunos/Students - usar dados da seção "Alunos" se existir
    const alunosSection = navData.navMain.find(section => section.title === 'Alunos');
    breadcrumbConfig.students = {
        label: 'Alunos',
        items: alunosSection?.links.map(link => ({
            label: link.name,
            href: link.to
        })) || [
                { label: 'Ver alunos', href: '/admin/students?tab=all' },
                { label: 'Cadastrar aluno', href: '/admin/students?tab=create' },
            ]
    };

    return breadcrumbConfig;
}