import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import type { UsersFilterType } from "@idiomax/http-schemas/users-filter";
import { getStudentByEmail, updateStudent } from '@/services/students';

export const useStudent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab");
    const email = searchParams.get("email") || "";

    const { data: courses } = useQuery({
        queryKey: ["courses-search"],
        queryFn: () => {
            // TODO: Implementar busca de cursos quando disponível
            return Promise.resolve([]);
        },
    });





    function datesForCalendar() {
        const date = new Date();
        const end = date.getFullYear();
        const start = new Date(date.getFullYear() - 70, 0, 0).getFullYear();
        const ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    }



    function Data() {
        const { data: books, isLoading } = useQuery({
            queryKey: ["book"],
            queryFn: () => {
                // TODO: Implementar busca de livros quando disponível
                return Promise.resolve([]);
            },
        });

        const { data: student } = useQuery({
            queryKey: ["student", email],
            queryFn: () => email ? getStudentByEmail(email) : Promise.resolve(null),
            enabled: !!email,
        });

        return { books, student, isLoading };
    }

    function cleanParams() {
        setSearchParams((state) => {
            state.delete("name");
            state.delete("email");
            state.delete("course");
            state.delete("per_page");
            state.delete("page");
            return state;
        });
    }

    function cleanFilter() {
        setSearchParams((state) => {
            state.delete("name");
            state.delete("email");
            state.delete("course");
            return state;
        });
    }

    function handleFilterStudents({ name, email, course }: UsersFilterType) {
        setSearchParams((state) => {
            if (name) {
                state.set("name", name);
            } else {
                state.delete("name");
            }
            return state;
        });

        setSearchParams((state) => {
            if (email) {
                state.set("email", email);
            } else {
                state.delete("email");
            }
            return state;
        });

        setSearchParams((state) => {
            if (course) {
                state.set("course", course);
            } else {
                state.delete("course");
            }
            return state;
        });
    }

    function handleTab(e: string) {
        setSearchParams((state) => {
            state.set("tab", e);
            return state;
        });
        cleanParams();
    }

    useEffect(() => {
        if (!activeTab) {
            setSearchParams((state) => {
                state.set("tab", "all");
                return state;
            });
        }
    }, [activeTab, setSearchParams]);

    return {
        handleTab,
        updateStudent,
        books: Data().books,
        isLoading: Data().isLoading,
        student: Data().student,
        datesForCalendar,
        handleFilterStudents,
        cleanFilter,
        searchParams,
        courses,
    };
};