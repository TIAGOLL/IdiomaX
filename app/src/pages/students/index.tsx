import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { UpdateStudents } from "./components/update-student";
import { DataTableStudents } from "./components/data-table-student";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersFilterSchema } from "@idiomax/http-schemas/users-filter"
import type { Course } from "@idiomax/http-schemas/entities"
import { useSearchParams } from "react-router";
import { useStudent } from "./use-student";
import { useForm } from "react-hook-form";
import { CreateStudents } from "./components/create-student";
export function StudentsPage() {

    const [searchParams] = useSearchParams()
    const { handleFilterStudents, cleanFilter, courses } = useStudent();

    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const course = searchParams.get('course') || null
    const activeTab = searchParams.get('tab') || undefined

    const { register, handleSubmit, setValue, watch } = useForm({
        resolver: zodResolver(UsersFilterSchema),
        values: {
            role: 'STUDENT' as const,
            name: name ?? '',
            email: email ?? '',
            course: course ?? ''
        }
    })

    return (
        <div className='flex justify-center items-center bg-slate-100 dark:bg-slate-600 sm:w-full'>
            <div className='flex w-full justify-center items-center'>
                {!activeTab || activeTab === 'all' && (
                    <div className="w-[calc(100vw-140px-150px)] mt-10">
                        <form onSubmit={handleSubmit(handleFilterStudents)} className='flex items-center gap-2 w-8/12 mb-10'>
                            <Input placeholder="Nome" {...register('name')} />
                            <Input placeholder="E-mail" {...register('email')} />
                            <Select onValueChange={(value) => setValue('course', value)} value={watch("course")}>
                                <SelectTrigger className={cn(watch("course") ? "" : "text-muted-foreground")}>
                                    <SelectValue placeholder="Curso" />
                                </SelectTrigger>
                                <SelectContent {...register('course')}>
                                    <SelectGroup>
                                        {
                                            courses?.map((course: Course) => (
                                                <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Button type="submit" variant="link">
                                <Search className='w-4 h-4 mr-2' />
                                Pesquisar
                            </Button>

                            <Button type="submit" variant="link" onClick={() => cleanFilter()}>
                                <X className='w-4 h-4 mr-2' />
                                Limpar filtros
                            </Button>
                        </form>
                        <DataTableStudents />
                    </div>
                )}
                {activeTab === 'create' && (
                    <div className="w-[calc(100vw-140px-150px)] justify-center flex">
                        <CreateStudents />
                    </div>
                )}
                {activeTab === 'update' && (
                    <div className="w-[calc(100vw-140px-150px)] justify-center flex" >
                        <UpdateStudents />
                    </div>
                )}
            </div>
        </div>
    );
}