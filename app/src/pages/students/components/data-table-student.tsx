import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoaderIcon, Power, Trash2, ScrollText, Save, KeyRound, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Text } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { PaginationSection } from '@/components/pagination-section';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { updateUserPasswordBody } from "@idiomax/http-schemas/update-user-password";
import { CreatePaginationArray } from "@/lib/utils";
import { toast } from "sonner";
import { updateStudentPassword, deleteStudent, deactivateStudent } from '@/services/students';
import { getStudents } from '@/services/students';

export function DataTableStudents() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateUserPasswordBody),
        mode: "all",
        criteriaMode: "all",
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const course = searchParams.get("course");
    const activeTab = searchParams.get("tab");

    const {
        data: students,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["students1", name, email, course],
        queryFn: () => getStudents(),
    });

    const studentsPages = CreatePaginationArray(students?.users || [], page, per_page);

    // Mutation para atualizar senha
    const updatePasswordMutation = useMutation({
        mutationFn: async (formData: { currentPassword: string; newPassword: string; studentId: string }) => {
            const response = await updateStudentPassword(formData.studentId, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            return response;
        },
        onSuccess: () => {
            toast.success("Senha atualizada com sucesso!");
            refetch();
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : "Erro ao atualizar senha";
            toast.error(errorMessage);
        }
    });

    // Mutation para deletar estudante
    const deleteStudentMutation = useMutation({
        mutationFn: async (studentId: string) => {
            const response = await deleteStudent(studentId);
            return response;
        },
        onSuccess: () => {
            toast.success("Estudante excluído com sucesso!");
            refetch();
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao excluir estudante"
                : "Erro ao excluir estudante";
            toast.error(errorMessage);
        }
    });

    // Mutation para desativar estudante
    const deactivateStudentMutation = useMutation({
        mutationFn: async (studentId: string) => {
            const response = await deactivateStudent(studentId);
            return response;
        },
        onSuccess: () => {
            toast.success("Estudante desativado com sucesso!");
            refetch();
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao desativar estudante"
                : "Erro ao desativar estudante";
            toast.error(errorMessage);
        }
    });

    useEffect(() => {
        if (!activeTab) {
            setSearchParams((state) => {
                state.set("tab", "all");
                return state;
            });
        }
    }, [activeTab, setSearchParams]);

    return (
        <>
            <div className='border rounded-lg rounded-b-none'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Curso(s)</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Mensalidade (total)</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !isLoading && studentsPages?.map((student) => (
                                <TableRow key={student?.email}>
                                    <TableCell>{student?.id}</TableCell>
                                    <TableCell className="font-medium">{student?.name}</TableCell>
                                    <TableCell>{student?.email}</TableCell>
                                    <TableCell className="flex flex-row gap-1">
                                        {/* TODO: Implementar busca de matrículas por usuário */}
                                        S/C
                                    </TableCell>
                                    <TableCell>{student?.cpf}</TableCell>
                                    <TableCell>
                                        {/* TODO: Calcular mensalidades quando implementar matrículas */}
                                        R$ 0,00
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button variant="link" className="py-0 px-0 m-0">
                                                        <a href={`/admin/students?tab=update&email=${student?.email}`} className='flex flex-row bg-green-400 justify-center items-center p-1 rounded-md'>
                                                            <Pencil className='w-4 h-4 dark:text-black' />
                                                        </a>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Editar
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <span className='pt-3'>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger className='bg-orange-300 p-1 m-0 rounded-md'>
                                                                <KeyRound className="w-4 h-4 dark:text-black" />
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent >
                                                                <form onSubmit={handleSubmit((data) => updatePasswordMutation.mutate({ ...data, studentId: student.id }))} className='flex flex-col gap-6'>
                                                                    <AlertDialogTitle>Editar senha</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Digite a nova senha para o usuário: <span className='font-bold'>{student?.name}</span>
                                                                    </AlertDialogDescription>
                                                                    <div className='grid grid-cols-2 gap-3'>
                                                                        <div className='col-span-2 gap-1 grid w-8/12'>
                                                                            <Label htmlFor="currentPassword">Senha Atual</Label>
                                                                            <Input type="password" {...register("currentPassword")} />
                                                                            {errors.currentPassword && <span className="text-red-500 text-sm">{errors.currentPassword.message}</span>}
                                                                        </div>
                                                                        <div className='col-span-2 gap-1 grid w-8/12'>
                                                                            <Label htmlFor="newPassword">Nova Senha</Label>
                                                                            <Input type="password" {...register("newPassword")} />
                                                                            {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
                                                                        </div>
                                                                        <AlertDialogFooter className="col-span-2">
                                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                            <AlertDialogAction type="submit">
                                                                                {updatePasswordMutation.isPending ? <LoaderIcon className='animate-spin w-4 h-4 dark:text-black mr-2' /> : <Save className='w-4 h-4 dark:text-black mr-2' />}
                                                                                Salvar
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </div>
                                                                </form>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Mudar senha
                                                </TooltipContent>
                                            </Tooltip >
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <span className='pt-3'>
                                                        <Dialog >
                                                            <DialogTrigger asChild >
                                                                <button className='bg-slate-400 p-1 m-0 rounded-md'>
                                                                    <Text className="w-4 h-4 dark:text-black" />
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-[calc(100vw-300px)] flex flex-col h-[calc(100vh-150px)]">
                                                                <DialogTitle>Registros do aluno</DialogTitle>
                                                                <DialogDescription>
                                                                    Aqui você tem um histórico de registros do aluno: <span className='font-bold'>{student?.name}</span>
                                                                </DialogDescription>
                                                                {/* TODO: Implementar busca de registros quando disponível */}
                                                                <div className='h-auto'>
                                                                    <Label>Nenhum registro encontrado</Label>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ver registros
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <span className='pt-3'>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="link" className="p-0 m-0">
                                                                    <div className='flex flex-row bg-zinc-200 justify-center items-center p-1 rounded-md'>
                                                                        <DotsHorizontalIcon className='w-4 h-4  text-black' />
                                                                    </div>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-56">
                                                                <DropdownMenuLabel>Mais ações</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuGroup >
                                                                    <DropdownMenuItem onSelect={() => window.location.assign(`/admin/registrations?tab=create&id=${student?.id}`)}>
                                                                        Matricular aluno
                                                                        <DropdownMenuShortcut><ScrollText className='w-4 h-4 dark:text-white' /></DropdownMenuShortcut>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onSelect={() => {
                                                                        if (student?.id) {
                                                                            deactivateStudentMutation.mutate(student.id);
                                                                        }
                                                                    }}>
                                                                        Desativar aluno
                                                                        <DropdownMenuShortcut><Power className='w-4 h-4 dark:text-white' /></DropdownMenuShortcut>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onSelect={() => {
                                                                        if (student?.id) {
                                                                            deleteStudentMutation.mutate(student.id);
                                                                        }
                                                                    }}>
                                                                        Excluir
                                                                        <DropdownMenuShortcut><Trash2 className='w-4 h-4 dark:text-white' /></DropdownMenuShortcut>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Mais ações
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {
                            isLoading && (
                                <TableRow>
                                    <TableCell className="font-medium">
                                        <Skeleton className="h-6 w-4/12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-4/12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-4/12" />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="text-right" colSpan={6}>Total de alunos:</TableCell>
                            <TableCell className="text-left">{students?.totalCount || 0}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div >
            <div className="border p-2 border-t-0 rounded-b-lg">
                <PaginationSection
                    data={students}
                />
            </div>
        </>
    );
}