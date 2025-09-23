import { useNavigate } from "react-router"
import { useSessionContext } from "@/contexts/session-context"
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getUserMenuData } from "../data/user-menu-data"

export function NavUserMenuItems() {
    const navigate = useNavigate()
    const { currentRole } = useSessionContext()

    // Função para verificar se o usuário tem permissão para ver o item
    const hasPermission = (requiredRoles: string[]): boolean => {
        if (!currentRole) return false

        // Converter role para minúscula para comparação case-insensitive
        const userRole = currentRole.toLowerCase()
        const allowedRoles = requiredRoles.map(role => role.toLowerCase())

        return allowedRoles.includes(userRole)
    }

    // Obter dados do menu e filtrar itens que o usuário pode ver
    const userMenuItems = getUserMenuData()
    const visibleMenuItems = userMenuItems.filter(item => hasPermission(item.roles))

    if (visibleMenuItems.length === 0) {
        return null
    }

    return (
        <>
            <DropdownMenuGroup>
                {visibleMenuItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                        <DropdownMenuItem
                            key={item.label}
                            onClick={() => navigate(item.href)}
                        >
                            <IconComponent />
                            {item.label}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
        </>
    )
}