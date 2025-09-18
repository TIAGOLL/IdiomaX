"use client"

import { ChevronsUpDown, Factory } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSessionContext } from "@/contexts/session-context"

export function CompanySwitcher() {
    const { isMobile } = useSidebar()
    const { userProfile, currentCompanyMember, currentRole, setCompany } = useSessionContext();

    if (!currentCompanyMember) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="shadow-sm shadow-primary/20">
                        <SidebarMenuButton size="lg">
                            <Avatar className="rounded-xl justify-center items-center flex">
                                <AvatarImage src={currentCompanyMember?.company.logo_16x16_url || ''} />
                                <AvatarFallback>
                                    <Factory className="size-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{currentCompanyMember?.company.name}</span>
                                <span className="truncate text-xs">{currentRole}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Instituições que você faz parte
                        </DropdownMenuLabel>
                        {userProfile?.member_on.map((member, index) => (
                            <DropdownMenuItem
                                key={member.company.name}
                                onClick={() => {
                                    setCompany(member)
                                }}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Avatar className="size-5 shrink-0 rounded-xl">
                                        <AvatarImage src={member.company.logo_16x16_url || ""} />
                                        <AvatarFallback>
                                            <Factory className="size-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                {member.company.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
