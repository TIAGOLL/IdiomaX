import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger, } from "@/components/ui/sheet";
import { Menu, Power, Circle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Settings } from "lucide-react";
import { NavLink } from "react-router";
import { FaCircle } from "react-icons/fa";
import { useAuth } from '@/contexts/auth-context';
import { ModeToggle } from './ui/mode-toggle';
import { useState } from 'react';


export function SideBar() {
    const { logout } = useAuth();
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="w-30 m-4 mt-5">
                <Button variant="outline" className="gap-2">
                    <Menu width={20} />
                    Menu
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="flex flex-col w-full justify-center items-center !text-center">
                    <div className="absolute left-6 top-10">
                        <ModeToggle />
                    </div>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full space-y-2 gap-4 mt-10">
                    {getLinks().map((item, index) => {
                        return (
                            <AccordionItem value={`item-${index}`} className="border-2 border-[hsl(var(--input))] p-1 rounded-md" key={index}>
                                <AccordionTrigger className="p-2">
                                    {item.title}
                                </AccordionTrigger >
                                <AccordionContent className="border-0 m-0 py-0.5 space-y-1">
                                    {
                                        item.links.map((link) => {
                                            return <div key={link.name}>
                                                <NavLink to={link.to} className={({ isActive }) => isActive ? "hover:underline flex flex-row gap-2 items-center ml-5" : "hidden"} onClick={() => setSheetOpen(false)}>
                                                    <FaCircle className="w-2 h-2" />
                                                    {link.name}
                                                </NavLink>
                                                <NavLink to={link.to} className={({ isActive }) => isActive ? "hidden" : "hover:underline flex flex-row gap-2 items-center ml-5"} onClick={() => setSheetOpen(false)}>
                                                    <Circle className="w-2 h-2" />
                                                    {link.name}
                                                </NavLink>
                                            </div>
                                        })
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                <SheetFooter className="absolute bottom-2 w-10/12">
                    <div className="w-full !justify-between flex">
                        <SheetClose asChild >
                            <Button variant="link" className="gap-2" onClick={() => logout()}><Power width={20} />Desconectar</Button>
                        </SheetClose>
                        <SheetClose asChild >
                            <a href="/admin/preferences?tab=general">
                                <Button variant="ghost" className="gap-2" >
                                    <Settings width={20} />
                                </Button>
                            </a>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet >
    );
}

function getLinks() {
    return [
        { title: "Dashboard", links: [{ name: "Dashboard", to: "/admin/dashboard" }] },
        {
            title: "Alunos",
            links: [
                { name: "Ver alunos", to: "/admin/students?tab=all" },
                { name: "Cadastrar aluno", to: "/admin/students?tab=create" },
            ],
        },
        {
            title: "Cursos",
            links: [
                { name: "Ver cursos", to: "/admin/courses?tab=all" },
                { name: "Cadastrar curso", to: "/admin/courses?tab=create" },
                { name: "Ver matrículas", to: "/admin/registrations?tab=all" },
                { name: "Matricular aluno", to: "/admin/registrations?tab=create" },
            ],
        },
        {
            title: "Turmas",
            links: [
                { name: "Ver todas", to: "/admin/classrooms?tab=all" },
                { name: "Cadastrar turma", to: "/admin/classrooms?tab=create" },
            ],
        },
        {
            title: "Funcionários",
            links: [
                { name: "Ver todos", to: "/admin/professionals?tab=all" },
                { name: "Cadastrar funcinário", to: "/admin/professionals?tab=create" },
            ],
        },
    ];
}
