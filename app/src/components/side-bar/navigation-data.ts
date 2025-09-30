import { BadgeCheck, BriefcaseBusiness, Cog, LayoutDashboardIcon, LifeBuoyIcon, MessageCircleMore } from "lucide-react"

export function getNavigationData() {
    return {
        navMain: [
            {
                title: "Dashboard",
                icon: LayoutDashboardIcon,
                breadcrumbKey: "admin",
                links: [{
                    name: "Visão geral",
                    to: "/",
                    roles: ['admin']
                }]
            },
            {
                title: "Cursos",
                icon: LayoutDashboardIcon,
                breadcrumbKey: "courses",
                links: [
                    { name: "Ver cursos", to: "/admin/courses?tab=list", roles: ['admin'] },
                    { name: "Cadastrar curso", to: "/admin/courses?tab=create", roles: ['admin'] },
                    { name: "Ver matrículas", to: "/admin/registrations?tab=list", roles: ['admin'] },
                    { name: "Matricular aluno", to: "/admin/registrations?tab=create", roles: ['admin'] },
                ],
            },
            {
                title: "Turmas",
                icon: LayoutDashboardIcon,
                breadcrumbKey: "class",
                links: [
                    { name: "Ver turmas", to: "/admin/class?tab=list", roles: ['admin'] },
                    { name: "Cadastrar turma", to: "/admin/class?tab=create", roles: ['admin'] },
                    { name: "Ver aulas", to: "/admin/classes?tab=list", roles: ['admin', 'teacher'] },
                    { name: "Cadastrar aula", to: "/admin/classes?tab=create", roles: ['admin', 'teacher'] },
                ],
            },
            {
                title: "Usuários",
                icon: LayoutDashboardIcon,
                breadcrumbKey: "users",
                links: [
                    { name: "Criar usuário", to: "/admin/users?tab=create", roles: ['admin'] },
                    { name: "Listar usuários", to: "/admin/users?tab=list", roles: ['admin'] },
                ],
            },
        ],
        navSecondary: [
            { title: "Suporte", url: "https://wa.me/+5542984066420", icon: LifeBuoyIcon },
            { title: "Feedback", url: "https://wa.me/+5542984066420", icon: MessageCircleMore },
        ],
        userMenu: [
            {
                label: "Meu perfil",
                href: '/profile',
                icon: BadgeCheck,
                roles: ['STUDENT', 'TEACHER', 'ADMIN']
            },
            {
                label: "Perfil da empresa",
                href: '/my-company?tab=profile',
                icon: BriefcaseBusiness,
                roles: ['ADMIN']
            },
            {
                label: "Configurar instituição",
                href: '/my-company?tab=settings',
                icon: Cog,
                roles: ['ADMIN']
            },
        ]
    }
}

// Função para gerar configuração do breadcrumb baseada nos dados de navegação
export function getBreadcrumbConfig() {
    const navData = getNavigationData();

    const breadcrumbConfig: Record<string, { label: string; items: { label: string; href: string }[] }> = {};

    // Processar navMain
    navData.navMain.forEach(section => {
        const key = section.breadcrumbKey || section.title.toLowerCase();
        breadcrumbConfig[key] = {
            label: section.title,
            items: section.links.map(link => ({
                label: link.name,
                href: link.to
            }))
        };
    });

    // Processar userMenu
    navData.userMenu.forEach(menuItem => {
        const urlPath = menuItem.href.split('?')[0];
        const pathSegments = urlPath.split('/').filter(segment => segment);

        if (pathSegments.length > 0) {
            const mainKey = pathSegments[0];

            if (!breadcrumbConfig[mainKey]) {
                breadcrumbConfig[mainKey] = {
                    label: mainKey === 'my-company' ? 'Minha Empresa' : 'Perfil',
                    items: []
                };
            }

            breadcrumbConfig[mainKey].items.push({
                label: menuItem.label,
                href: menuItem.href
            });
        }
    });

    // Adicionar Dashboard se não existir
    if (!breadcrumbConfig.admin) {
        breadcrumbConfig.admin = {
            label: 'Administração',
            items: [
                { label: 'Dashboard', href: '/' },
            ]
        };
    }

    return breadcrumbConfig;
}