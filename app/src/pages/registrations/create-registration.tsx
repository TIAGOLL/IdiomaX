import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon, Users, Save, Check, ChevronsUpDown } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRegistrationFormSchema } from '@idiomax/validation-schemas/registrations/create-registration';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { getUsers } from '@/services/users/get-users';
import { createRegistration } from '@/services/registrations';
import { getCourses } from '@/services/courses/get-courses';

type CreateRegistrationFormSchema = z.infer<typeof CreateRegistrationFormSchema>;

export function CreateRegistrationPage() {
    const [comboboxOpen, setComboboxOpen] = useState(false);

    // Query para buscar usuários disponíveis
    const { data: users, isPending: isLoadingUsers } = useQuery({
        queryKey: ['users', 'ALL', getCurrentCompanyId()],
        queryFn: () => getUsers({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    // Query para buscar cursos disponíveis
    const { data: courses, isPending: isLoadingCourses } = useQuery({
        queryKey: ['courses', getCurrentCompanyId()],
        queryFn: () => getCourses({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateRegistrationFormSchema) => {
            const response = await createRegistration({
                ...data,
                company_id: getCurrentCompanyId(),
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            reset();
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.message);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(CreateRegistrationFormSchema),
        mode: "all",
        criteriaMode: "all",
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Nova Inscrição
                    </CardTitle>
                    <CardDescription>
                        Preencha os campos abaixo para criar uma nova inscrição de estudante.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Formulário */}
            <Card>
                <form onSubmit={handleSubmit((data) => mutate(data))}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Estudante *</Label>
                                <Controller
                                    name="user_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    role="combobox"
                                                    aria-expanded={comboboxOpen}
                                                    className="w-full justify-between"
                                                    disabled={isLoadingUsers}
                                                >
                                                    {field.value
                                                        ? users?.find((user) => user.id === field.value)?.name
                                                        : "Selecione o estudante..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar estudante..." />
                                                    <CommandList className="max-h-[200px]">
                                                        <CommandEmpty>Nenhum estudante encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {isLoadingUsers ? (
                                                                <CommandItem disabled>
                                                                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                                                    Carregando estudantes...
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
                                <FormMessageError error={errors.user_id?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label>Curso *</Label>
                                <Controller
                                    name="course_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isLoadingCourses}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={isLoadingCourses ? "Carregando..." : "Selecione um curso"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses?.map((course) => (
                                                    <SelectItem key={course.id} value={course.id}>
                                                        {course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormMessageError error={errors.course_id?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start_date">Data de Início *</Label>
                                <Input
                                    type="date"
                                    id="start_date"
                                    {...register('start_date')}
                                />
                                <FormMessageError error={errors.start_date?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthly_fee_amount">Valor da Mensalidade (R$) *</Label>
                                <Input
                                    id="monthly_fee_amount"
                                    placeholder="0.00"
                                    {...register('monthly_fee_amount', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.monthly_fee_amount?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount_payment_before_due_date">Valor do Desconto de Pagamento Antecipado (R$) *</Label>
                                <Input
                                    id="discount_payment_before_due_date"
                                    placeholder="0.00"
                                    {...register('discount_payment_before_due_date', { valueAsNumber: true })}
                                />
                                <FormMessageError error={errors.discount_payment_before_due_date?.message} />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 mt-10">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Matricular
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}