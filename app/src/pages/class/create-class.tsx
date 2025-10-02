import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, LoaderIcon, Save, Users, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateClassFormSchema } from '@idiomax/validation-schemas/class/create-class';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { createClass } from '@/services/class/create-class';
import { getCourses } from '@/services/courses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getUsers } from '@/services/users/get-users';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Schema para adicionar usuário no dialog
const addUserSchema = z.object({
    user_id: z.string().min(1, 'Selecione um usuário'),
    teacher: z.boolean()
});

type AddUserFormData = z.infer<typeof addUserSchema>;

type CreateClassRequest = z.infer<typeof CreateClassFormSchema>;

type AddedUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

const WEEK_DAYS = [
    { id: 'MONDAY', label: 'Segunda-feira' },
    { id: 'TUESDAY', label: 'Terça-feira' },
    { id: 'WEDNESDAY', label: 'Quarta-feira' },
    { id: 'THURSDAY', label: 'Quinta-feira' },
    { id: 'FRIDAY', label: 'Sexta-feira' },
    { id: 'SATURDAY', label: 'Sábado' },
    { id: 'SUNDAY', label: 'Domingo' },
];

export function CreateClassPage() {
    const [addedUsers, setAddedUsers] = useState<AddedUser[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateClassRequest) => {
            const response = await createClass({
                company_id: getCurrentCompanyId(),
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourses({ company_id: getCurrentCompanyId() }),
    });

    // Query para buscar usuários disponíveis
    const { data: users, isPending: isLoadingUsers } = useQuery({
        queryKey: ['users', 'ALL', getCurrentCompanyId()],
        queryFn: () => getUsers({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(CreateClassFormSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: '',
            vacancies: 1,
            course_id: '',
        }
    });

    // Form para adicionar usuário no dialog
    const {
        handleSubmit: handleSubmitAddUser,
        formState: { errors: addUserErrors },
        reset: resetAddUser,
        control: addUserControl
    } = useForm<AddUserFormData>({
        resolver: zodResolver(addUserSchema),
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            user_id: '',
            teacher: false
        }
    });

    const handleAddUser = (data: AddUserFormData) => {
        const selectedUser = users?.find(user => user.id === data.user_id);
        if (!selectedUser) {
            toast.error('Usuário não encontrado');
            return;
        }

        // Verificar se o usuário já foi adicionado
        if (addedUsers.some(user => user.id === selectedUser.id)) {
            toast.error('Usuário já foi adicionado');
            return;
        }

        const newUser: AddedUser = {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: data.teacher ? 'TEACHER' : 'STUDENT'
        };

        setAddedUsers([...addedUsers, newUser]);
        toast.success(`${selectedUser.name} adicionado com sucesso`);
        setDialogOpen(false);
        resetAddUser();
    };

    return (
        <Card className="mx-auto">
            <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                    <PlusCircle className="w-5 h-5" />
                    Criar Turma
                </CardTitle>
                <CardDescription>Preencha os dados para cadastrar uma nova turma.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <CardContent className="space-y-4 grid-cols-3 grid space-x-2">
                    <div className='space-y-2 col-span-1'>
                        <Label htmlFor="name">Nome da turma</Label>
                        <Input id="name" {...register('name')} autoFocus />
                        <FormMessageError error={errors.name} />
                    </div>
                    <div className='space-y-2 col-span-1'>
                        <Label htmlFor="vacancies">Vagas</Label>
                        <Input id="vacancies" type="number" min={1} {...register('vacancies', { valueAsNumber: true })} />
                        <FormMessageError error={errors.vacancies} />
                    </div>
                    <div className='space-y-2 col-span-1'>
                        <Label htmlFor="course_id">Curso</Label>
                        <Controller
                            name="course_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => field.onChange(value)}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um curso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            courses?.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormMessageError error={errors.course_id} />
                    </div>

                    <Separator className='col-span-3' />

                    {/* Dias da semana */}
                    <div className='space-y-3 col-span-3'>
                        <Label>Dias da semana</Label>
                        <div className='grid grid-cols-7 gap-3'>
                            {WEEK_DAYS.map((day) => (
                                <div key={day.id} className="flex flex-col items-center space-x-2">
                                    <Checkbox
                                        id={day.id}
                                        checked={selectedDays.includes(day.id)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) {
                                                setSelectedDays([...selectedDays, day.id]);
                                            } else {
                                                setSelectedDays(selectedDays.filter(d => d !== day.id));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={day.id} className="text-sm font-normal cursor-pointer">
                                        {day.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className='col-span-3' />

                    {/* Alunos da turma */}
                    <div className='space-y-3 col-span-3'>
                        <div className="flex items-center justify-between">
                            <Label>Alunos da turma ({addedUsers.length})</Label>
                            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className='!border-primary'
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Adicionar Aluno
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[100vw] min-w-[30vw] min-h-[30vh]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Adicionar usuário para a turma</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <form onSubmit={handleSubmitAddUser(handleAddUser)} className="space-y-4">
                                        <div className="w-[30em] gap-4 flex justify-center flex-col">
                                            <div className="space-y-2">
                                                <Label htmlFor="user_id">Usuário</Label>
                                                <Controller
                                                    name="user_id"
                                                    control={addUserControl}
                                                    render={({ field }) => (
                                                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={comboboxOpen}
                                                                    className="w-full justify-between"
                                                                >
                                                                    {field.value
                                                                        ? users?.find((user) => user.id === field.value)?.name
                                                                        : "Selecione o usuário..."}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Buscar usuário..." />
                                                                    <CommandList className="max-h-[200px]">
                                                                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {isLoadingUsers ? (
                                                                                <CommandItem disabled>
                                                                                    Carregando usuários...
                                                                                </CommandItem>
                                                                            ) : (
                                                                                users?.map((user) => (
                                                                                    <CommandItem
                                                                                        key={user.id}
                                                                                        value={`${user.name} ${user.email}`}
                                                                                        onSelect={() => {
                                                                                            field.onChange(user.id === field.value ? "" : user.id);
                                                                                            setComboboxOpen(false);
                                                                                        }}
                                                                                    >
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "mr-2 h-4 w-4",
                                                                                                field.value === user.id ? "opacity-100" : "opacity-0"
                                                                                            )}
                                                                                        />
                                                                                        {user.name} ({user.email})
                                                                                    </CommandItem>
                                                                                ))
                                                                            )}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                />
                                                <FormMessageError error={addUserErrors?.user_id?.message} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="teacher">Função</Label>
                                                <Controller
                                                    name="teacher"
                                                    control={addUserControl}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value?.toString()}
                                                            onValueChange={(value) => field.onChange(value === "true")}
                                                            defaultValue={field.value?.toString()}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecione uma função" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="true">Professor</SelectItem>
                                                                <SelectItem value="false">Estudante</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FormMessageError error={addUserErrors?.teacher?.message} />
                                            </div>
                                        </div>
                                        <Separator />
                                        <AlertDialogFooter className="flex !justify-between w-full">
                                            <AlertDialogCancel
                                                type="button"
                                                onClick={() => {
                                                    setDialogOpen(false);
                                                    resetAddUser();
                                                }}
                                            >
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction type="submit">
                                                Adicionar
                                                <Save className="size-4 ml-2" />
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </form>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        {addedUsers.length > 0 ? (
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Função</TableHead>
                                            <TableHead className="w-[100px]">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {addedUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'TEACHER' ? 'destructive' : 'secondary'}>
                                                        {user.role === 'TEACHER' ? 'Professor' : 'Estudante'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setAddedUsers(addedUsers.filter(u => u.id !== user.id));
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                                Nenhum aluno adicionado ainda.
                                <br />
                                <span className="text-sm">Clique em "Adicionar Aluno" para começar.</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-10">
                    <Button type="submit" disabled={isPending}>
                        {isPending && "Criando..."}
                        {!isPending && "Criar Turma"}
                        {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
                        {!isPending && <Save className="ml-2" />}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
