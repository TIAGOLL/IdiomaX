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
import { getNavigationData } from "@/lib/navigation-data"


export function Sidebar({ ...props }: React.ComponentProps<typeof SideBarComponent>) {

    const { userProfile, } = useSessionContext();

    if (!userProfile) return null;

    return (
        <SideBarComponent collapsible="icon" {...props}>
            <SidebarHeader>
                <CompanySwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={getNavigationData().navMain} />
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </SideBarComponent>
    )
}