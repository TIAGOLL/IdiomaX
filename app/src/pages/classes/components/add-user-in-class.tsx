import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, LoaderIcon, Save } from 'lucide-react';
import { Controller, useForm, } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessageError } from '@/components/ui/form-message-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { useState } from 'react';

import { AddUserInClassFormSchema } from '@idiomax/validation-schemas/class/add-user-in-class';
import type z from 'zod';
import { addUserInClass } from '@/services/class/add-user-in-class';
import { getUsers } from '@/services/users/get-users';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AddUserInClassFormSchema = z.infer<typeof AddUserInClassFormSchema>;

export function AddUserInClassForm({ classId }: { classId: string }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [comboboxOpen, setComboboxOpen] = useState(false);

    // Query para buscar todos os usuários
    const { data: users, isPending: isLoadingUsers } = useQuery({
        queryKey: ['users', 'ALL', getCurrentCompanyId()],
        queryFn: () => getUsers({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

    // Mutation para criar level
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: AddUserInClassFormSchema) => {
            const response = await addUserInClass({
                company_id: getCurrentCompanyId(),
                class_id: classId,
                ...data
            });
            return response;
        },
        onSuccess: (res) => {
            toast.success(res.message);
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['class', classId] });
            reset();
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        resolver: zodResolver(AddUserInClassFormSchema),
        mode: "all",
        criteriaMode: "all",
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild onClick={() => { setOpen(true) }}>
                <Button variant="default" size="sm">
                    <PlusCircle className="size-4 mr-2" />
                    Adicionar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[100vw] min-w-[30vw] min-h-[30vh]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Adicionar usuário para a turma</AlertDialogTitle>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                    <div className="w-[30em] gap-4 flex justify-center flex-col">
                        <div className="space-y-2">
                            <Label htmlFor="user_id">Usuário</Label>
                            <Controller
                                name="user_id"
                                control={control}
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
                            <FormMessageError error={errors?.user_id?.message} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher">Função</Label>
                            <Controller
                                name="teacher"
                                control={control}
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
                        </div>
                    </div>
                    <Separator />
                    <AlertDialogFooter className="flex !justify-between w-full">
                        <AlertDialogCancel disabled={isPending} onClick={() => { setOpen(false); reset() }}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    Criando...
                                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Salvar
                                    <Save className="size-4 mr-2" />
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}