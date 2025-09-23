import { useState } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { useSessionContext } from "@/contexts/session-context"

export function NavMain({
    items,
}: {
    items: {
        title: string
        icon?: LucideIcon
        links: { name: string; to: string, roles: string[] }[]
        isActive?: boolean
    }[]
}) {
    const [allOpen, setAllOpen] = useState(false)
    const { currentRole } = useSessionContext()

    // Função para verificar se o usuário tem permissão para ver o link
    const hasPermission = (requiredRoles: string[]): boolean => {
        if (!currentRole) return false

        // Converter role para minúscula para comparação case-insensitive
        const userRole = currentRole.toLowerCase()
        const allowedRoles = requiredRoles.map(role => role.toLowerCase())

        return allowedRoles.includes(userRole)
    }

    // Filtrar items que têm pelo menos um link visível
    const filteredItems = items.map(item => ({
        ...item,
        links: item.links.filter(link => hasPermission(link.roles))
    })).filter(item => item.links.length > 0)

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="mb-2 flex items-center justify-between">
                Navegação
                <Button
                    variant="ghost"
                    className="ml-2 rounded px-2 py-1 text-xs"
                    onClick={() => setAllOpen((prev) => !prev)}
                >
                    {allOpen ? "Fechar tudo" : "Abrir tudo"}
                </Button>
            </SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        open={allOpen ? true : item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.links?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.name}>
                                            <SidebarMenuSubButton asChild>
                                                <NavLink to={subItem.to}>
                                                    <span>{subItem.name}</span>
                                                </NavLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
