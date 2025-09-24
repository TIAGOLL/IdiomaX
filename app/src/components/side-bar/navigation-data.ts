import { BadgeCheck, BriefcaseBusiness, Cog, LayoutDashboardIcon, LifeBuoyIcon, MessageCircleMore } from "lucide-react"

export function getNavigationData() {
    return {
        navMain: [
            {
                title: "Dashboard", icon: LayoutDashboardIcon, links: [{
                    name: "Visão geral", to: "/", roles: ['admin']
                }]
            },
            {
                title: "Cursos",
                icon: LayoutDashboardIcon,
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
                links: [
                    { name: "Ver turmas", to: "/admin/classes?tab=list", roles: ['admin'] },
                    { name: "Cadastrar turma", to: "/admin/classes?tab=create", roles: ['admin'] },
                    { name: "Ver aulas", to: "/admin/classes?tab=list", roles: ['admin', 'teacher'] },
                    { name: "Cadastrar aula", to: "/admin/classes?tab=create", roles: ['admin', 'teacher'] },
                ],
            },
            {
                title: "Usuários",
                icon: LayoutDashboardIcon,
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
                roles: ['STUDENT', 'TEACHER', 'ADMIN'] // Todos podem ver o perfil
            },
            {
                label: "Minha empresa",
                href: '/finances',
                icon: BriefcaseBusiness,
                roles: ['ADMIN'] // Apenas ADMINs podem ver finanças
            },
            {
                label: "Configurar instituição",
                href: '/config/company',
                icon: Cog,
                roles: ['ADMIN'] // Apenas ADMINs podem ver configurações
            },
        ]
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
            { label: 'Ver cursos', href: '/admin/courses?tab=list' },
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