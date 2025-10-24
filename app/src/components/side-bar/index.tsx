import {
    Sidebar as SideBarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./components/nav-main"
import { NavUser } from "./components/nav-user"
import { CompanySwitcher } from "./components/company-switcher"
import { ModeToggle } from "../ui/mode-toggle"
import { useSessionContext } from "@/contexts/session-context"
import { getNavigationData } from "./navigation-data"
import { NavSecondary } from "./components/nav-secondary"
import { useContext } from "react"
import { AbilityContext } from "@/lib/Can"


export function Sidebar({ ...props }: React.ComponentProps<typeof SideBarComponent>) {

    const { userProfile, } = useSessionContext();
    const ability = useContext(AbilityContext);

    if (!userProfile) return null;

    const navData = getNavigationData(ability);

    return (
        <SideBarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <CompanySwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
                <NavSecondary items={navData.navSecondary} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </SideBarComponent>
    )
}