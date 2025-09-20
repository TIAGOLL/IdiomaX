import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Eye, PlusCircle, Replace, Search, X } from "lucide-react";
import { CreateStudents } from "./components/create-students";
import { UpdateStudents } from "./components/update-student";
import { DataTableStudents } from "./components/data-table-student";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentsFilterSchema } from "@idiomax/http-schemas/students-filter"
import { useSearchParams } from "react-router";
import { useStudent } from "./use-student";
import { useForm } from "react-hook-form";
export function StudentsPage() {

    const [searchParams] = useSearchParams()
    const { handleFilterStudents, cleanFilter, handleTab, courses } = useStudent();

    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const course = searchParams.get('course') || null
    const activeTab = searchParams.get('tab') || undefined

    const { register, handleSubmit, setValue, watch } = useForm({
        resolver: zodResolver(StudentsFilterSchema),
        values: {
            name: name ?? '',
            email: email ?? '',
            course: course ?? ''
        }
    })

    return (
        <div className='flex justify-center items-center bg-slate-100 dark:bg-slate-600 sm:w-full'>
            <div className='flex w-full justify-center items-center'>
                <Tabs value={activeTab} onValueChange={handleTab} defaultValue="all" className="w-[calc(100vw-135px)] mt-5 justify-center items-center flex flex-col">
                    <TabsList className="grid w-[600px] grid-cols-3 h-full">
                        <TabsTrigger value="all" className="h-12" >
                            <Eye className='w-[20px] h-[20px] mr-2' />
                            Ver todos
                        </TabsTrigger>
                        <TabsTrigger value="create" className="h-12">
                            <PlusCircle className='w-[20px] h-[20px] mr-2' />
                            Cadastrar
                        </TabsTrigger>
                        <TabsTrigger value="update" disabled={activeTab != 'update'} className="h-12">
                            <Replace className='w-[20px] h-[20px] mr-2' />
                            Atualizar aluno
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="w-[calc(100vw-140px-150px)] mt-10">
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
                                            courses?.map((courses) => (
                                                <SelectItem key={courses.id} value={courses.name}>{courses.name}</SelectItem>
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
                    </TabsContent>
                    <TabsContent value="create" className="w-[calc(100vw-140px-150px)] justify-center flex">
                        <CreateStudents />
                    </TabsContent>
                    <TabsContent value="update" className="w-[calc(100vw-140px-150px)] justify-center flex" >
                        <UpdateStudents />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}