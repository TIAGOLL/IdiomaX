import { BadgeCheck, BriefcaseBusiness, Cog, LayoutDashboardIcon, LifeBuoyIcon, MessageCircleMore } from "lucide-react"
import type { AppAbility } from '@/lib/Can';

type NavigationPermission = {
    action: string;
    subject: string;
}

export function getNavigationData(ability?: AppAbility) {
    // Função helper para verificar se deve mostrar o item baseado nas permissões
    const shouldShowItem = (permissions: NavigationPermission[]) => {
        if (!ability) return false;

        // Se o usuário tem pelo menos uma das permissões necessárias, mostra o item
        return permissions.some(({ action, subject }) => {
            // Usar verificação genérica para evitar problemas de tipo
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (ability as any).can(action, subject);
            } catch {
                return false;
            }
        });
    };

    const allNavItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "admin",
            to: "/",
            permissions: [
                { action: 'manage', subject: 'all' }
            ]
        },
        {
            title: "Cursos",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "courses",
            to: "/admin/courses?tab=list",
            permissions: [
                { action: 'get', subject: 'Course' },
                { action: 'create', subject: 'Course' },
                { action: 'update', subject: 'Course' },
                { action: 'delete', subject: 'Course' }
            ]
        },
        {
            title: "Matrículas",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "registrations",
            to: "/admin/registrations?tab=list",
            permissions: [
                { action: 'get', subject: 'Registration' },
                { action: 'create', subject: 'Registration' },
                { action: 'update', subject: 'Registration' }
            ]
        },
        {
            title: "Turmas",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "classes",
            to: "/admin/classes?tab=list",
            permissions: [
                { action: 'get', subject: 'Class' },
                { action: 'create', subject: 'Class' },
                { action: 'update', subject: 'Class' },
                { action: 'delete', subject: 'Class' }
            ]
        },
        {
            title: "Aulas",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "lessons",
            to: "/admin/lessons?tab=list",
            permissions: [
                { action: 'get', subject: 'Lesson' },
                { action: 'create', subject: 'Lesson' },
                { action: 'update', subject: 'Lesson' },
                { action: 'delete', subject: 'Lesson' }
            ]
        },
        {
            title: "Usuários",
            icon: LayoutDashboardIcon,
            breadcrumbKey: "users",
            to: "/admin/users?tab=list",
            permissions: [
                { action: 'manage', subject: 'all' }
            ]
        },
    ];

    // Filtrar apenas os itens que o usuário tem permissão
    const navMain = ability
        ? allNavItems.filter(item => shouldShowItem(item.permissions))
        : allNavItems;

    return {
        navMain,
        navSecondary: [
            { title: "Suporte", url: "https://wa.me/+5542984066420", icon: LifeBuoyIcon },
            { title: "Feedback", url: "https://wa.me/+5542984066420", icon: MessageCircleMore },
        ],
        userMenu: ability && ability.can('manage', 'all') ? [
            {
                label: "Meu perfil",
                href: '/profile',
                icon: BadgeCheck,
            },
            {
                label: "Perfil da empresa",
                href: '/my-company?tab=profile',
                icon: BriefcaseBusiness,
            },
            {
                label: "Configurar instituição",
                href: '/my-company?tab=settings',
                icon: Cog,
            },
        ] : [
            {
                label: "Meu perfil",
                href: '/profile',
                icon: BadgeCheck,
            }
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
            items: [{
                label: section.title,
                href: section.to
            }]
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