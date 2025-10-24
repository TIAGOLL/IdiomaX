import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink, useLocation } from "react-router"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function NavMain({
    items,
}: {
    items: {
        title: string
        icon?: LucideIcon
        to: string
        breadcrumbKey?: string
    }[]
}) {
    const location = useLocation()

    // Função para verificar se o item está ativo
    const isItemActive = (itemTo: string) => {
        // Remover query params para comparação
        const itemPath = itemTo.split('?')[0]
        const currentPath = location.pathname

        // Para a rota raiz '/', verificar se é exatamente igual
        if (itemPath === '/') {
            return currentPath === '/'
        }

        // Para outras rotas, verificar se o pathname é igual ou começa com a rota
        return currentPath === itemPath || currentPath.startsWith(itemPath + '/')
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Navegação
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isItemActive(item.to)

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className={cn(
                                    isActive && buttonVariants({ variant: "default", size: "sm" }), "justify-start"
                                )}
                            >
                                <NavLink to={item.to}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
