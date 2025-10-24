import { useNavigate } from "react-router"
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getNavigationData } from "../navigation-data"
import { useContext } from "react"
import { AbilityContext } from "@/lib/Can"

export function NavUserMenuItems() {
    const navigate = useNavigate()
    const ability = useContext(AbilityContext)

    // Obter dados do menu filtrados por permissão
    const { userMenu } = getNavigationData(ability)

    if (userMenu.length === 0) {
        return null
    }

    return (
        <>
            <DropdownMenuGroup>
                {userMenu.map((item) => {
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