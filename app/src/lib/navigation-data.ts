import { LayoutDashboardIcon } from "lucide-react"

export function getNavigationData() {
    return {
        navMain: [
            { title: "Dashboard", icon: LayoutDashboardIcon, links: [{ name: "Visão geral", to: "/" }] },
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
                    { name: "Ver turmas", to: "/admin/classes?tab=all" },
                    { name: "Cadastrar turma", to: "/admin/classes?tab=create" },
                    { name: "Ver salas", to: "/admin/classrooms?tab=all" },
                    { name: "Cadastrar sala", to: "/admin/classrooms?tab=create" },
                    { name: "Ver aulas", to: "/admin/classes?tab=all" },
                    { name: "Cadastrar aula", to: "/admin/classes?tab=create" },
                ],
            },
            {
                title: "Usuários",
                icon: LayoutDashboardIcon,
                links: [
                    { name: "Criar usuário", to: "/admin/users?tab=create" },
                    { name: "Listar usuários", to: "/admin/users?tab=list" },
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
        if (sectionKey === 'usuários') urlKey = 'users';
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
            { label: 'Criar usuário', href: '/admin/users?tab=create' },
            { label: 'Listar usuários', href: '/admin/users?tab=list' },
            { label: 'Ver cursos', href: '/admin/courses?tab=all' },
        ]
    };

    // Usuários - usar dados da seção "Usuários" se existir
    const usuariosSection = navData.navMain.find(section => section.title === 'Usuários');
    breadcrumbConfig.users = {
        label: 'Usuários',
        items: usuariosSection?.links.map(link => ({
            label: link.name,
            href: link.to
        })) || [
                { label: 'Criar usuário', href: '/admin/users?tab=create' },
                { label: 'Listar usuários', href: '/admin/users?tab=list' },
            ]
    };

    return breadcrumbConfig;
}