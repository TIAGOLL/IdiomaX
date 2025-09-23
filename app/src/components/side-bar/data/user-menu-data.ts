import { BadgeCheck, BriefcaseBusiness } from "lucide-react"

export type UserMenuItem = {
    label: string
    href: string
    icon: React.ComponentType
    roles: string[]
}

export function getUserMenuData(): UserMenuItem[] {
    return [
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
        }
    ]
}