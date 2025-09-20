import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";

export const useStudent = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab");

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: errorsCreate,
        watch: watchCreate,
        setValue: setValueCreate,
    } = useForm({
        resolver: zodResolver(studentsCreateSchema),
        mode: "all",
        criteriaMode: "all",
    });

    const { data: courses } = useQuery({
        queryKey: ["coursesSearch"],
        queryFn: () => api.professionals.GetCourses(),
    });

    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: errorsUpdate,
        watch: watchUpdate,
        setValue: setValueUpdate,
    } = useForm({
        resolver: zodResolver(studentsUpdateSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: async () => {
            const data = await api.professionals.GetStudentByEmail(email);
            return {
                email: data?.email,
                dateOfBirth: data?.date_of_birth,
                firstName: data?.first_name,
                lastName: data?.last_name,
                cpf: data?.cpf,
                phone: data?.phone,
                gender: data?.gender,
                zipCode: data?.adresses?.zip_code,
                street: data?.adresses?.street,
                district: data?.adresses?.district,
                complement: data?.adresses?.complement,
                state: data?.adresses?.state,
                city: data?.adresses?.city,
                book: data?.registrations?.classrooms?.books_id,
                id: data?.id,
                number: data?.adresses?.number,
                user: data?.user,
                password: data?.password,
            };
        },
    });

    const email = searchParams.get("email");

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

    async function createStudent(data) {
        await api.professionals
            .CreateStudent({ ...data, createdBy: GetUser().id })
            .then((res) => {
                toast.success(res.message);
                navigate("/admin/students");
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message);
            });
    }

    async function updateStudent(data) {
        await api.professionals
            .UpdateStudent({ ...data, updatedBy: GetUser().id })
            .then((res) => {
                toast.success(res.message);
                navigate("/admin/students");
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.response.data.message);
            });
    }

    function Data() {
        const { data: books, isLoading } = useQuery({
            queryKey: ["book"],
            queryFn: () => api.books.GetBooks(),
        });

        const { data: student } = useQuery({
            queryKey: ["student", email],
            queryFn: () => api.professionals.GetStudentByEmail(email),
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

    function handleFilterStudents({ name, email, course }) {
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

    function handleTab(e) {
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
        registerCreate,
        handleSubmitCreate,
        handleTab,
        errorsCreate: errorsCreate.errors,
        watchCreate,
        setValueCreate,
        createStudent,
        updateStudent,
        books: Data().books,
        isLoading: Data().isLoading,
        student: Data().student,
        datesForCalendar,
        handleFilterStudents,
        cleanFilter,
        searchParams,
        registerUpdate,
        handleSubmitUpdate,
        errorsUpdate: errorsUpdate.errors,
        watchUpdate,
        setValueUpdate,
        user: GetUser(),
        courses,
    };
};