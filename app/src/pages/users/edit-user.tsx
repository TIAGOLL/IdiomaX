import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarIcon, Key, Trash2, UserCheck, UserX, X, Users, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateUser, adminResetPassword, deleteUser, deactivateUser, getUserById } from '@/services/users';
import { addUserRole, updateUserRole, removeUserRole } from '@/services/roles/manage-roles';
import { useSessionContext } from '@/contexts/session-context';
import type { UserWithRole, UserRole } from '@idiomax/http-schemas/users/get-users';
import { UpdateUserFormSchema } from '@idiomax/http-schemas/users/update-user';
import { AdminResetPasswordFormSchema } from '@idiomax/http-schemas/users/admin-reset-password';
import type { z } from 'zod';
import { useSearchParams } from 'react-router';

type EditUserFormData = z.infer<typeof UpdateUserFormSchema>;
type PasswordFormData = z.infer<typeof AdminResetPasswordFormSchema>;

// Função helper para obter label da role
const getRoleLabel = (role: UserRole) => {
    const labels = {
        STUDENT: '🎓 Estudante',
        TEACHER: '👨‍🏫 Professor',
        ADMIN: '👑 Administrador'
    };
    return labels[role];
};

// Função helper para obter dados do membro atual
const getCurrentUserData = (user: UserWithRole, companyId: string) => {
    const currentMembers = user.member_on.filter(member => member.company_id === companyId);

    if (currentMembers.length === 0) {
        return {
            userId: '',
            userRoles: [] as UserRole[],
            primaryRole: 'STUDENT' as UserRole
        };
    }

    const userRoles = currentMembers.map(member => member.role);
    // Prioridade: ADMIN > TEACHER > STUDENT
    const rolesPriority: UserRole[] = ['ADMIN', 'TEACHER', 'STUDENT'];
    const primaryRole = rolesPriority.find(role => userRoles.includes(role)) || 'STUDENT';

    return {
        userId: currentMembers[0].user_id,
        userRoles,
        primaryRole
    };
};

interface EditUserPageProps {
    userId: string;
}

/**
 * Componente para edição de usuário
 * 
 * Características:
 * - Suporta usuários com múltiplas roles na mesma empresa
 * - Usa role principal (ADMIN > TEACHER > STUDENT) para operações API
 * - Exibe todas as roles do usuário na seção de gerenciamento
 * - Permite adicionar novas roles que o usuário ainda não possui
 */
export function EditUserPage({ userId, }: EditUserPageProps) {
    const { currentCompanyMember } = useSessionContext();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
    const [roleToRemove, setRoleToRemove] = useState<UserRole | null>(null);
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    // Buscar dados do usuário
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    });

    // Form para edição de dados básicos
    const form = useForm<EditUserFormData>({
        resolver: zodResolver(UpdateUserFormSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            username: '',
            gender: 'M',
            date_of_birth: new Date(),
            address: '',
        },
    });

    // Form para alteração de senha
    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(AdminResetPasswordFormSchema),
    });

    // Mutations
    const updateUserMutation = useMutation({
        mutationFn: (data: EditUserFormData & { userId: string; primaryRole: UserRole }) => updateUser(data.primaryRole, {
            id: data.userId,
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            phone: data.phone,
            username: data.username,
            gender: data.gender,
            dateOfBirth: data.date_of_birth,
            address: data.address,
            role: data.primaryRole,
            companyId: currentCompanyMember?.company.id || ''
        }),
        onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setSearchParams({ tab: 'list' });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao atualizar usuário');
        },
    });

    const passwordMutation = useMutation({
        mutationFn: (data: PasswordFormData & { userId: string; primaryRole: UserRole }) => adminResetPassword(data.primaryRole, data.userId, data.newPassword),
        onSuccess: () => {
            toast.success('Senha redefinida com sucesso!');
            passwordForm.reset();
            setShowPasswordForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (data: { userId: string; primaryRole: UserRole }) => deleteUser(data.primaryRole, data.userId),
        onSuccess: () => {
            toast.success('Usuário excluído com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setSearchParams({ tab: 'list' });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao excluir usuário');
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: (data: { userId: string; primaryRole: UserRole; currentActive: boolean }) => deactivateUser(data.primaryRole, data.userId, !data.currentActive),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setSearchParams({ tab: 'list' });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: (role: UserRole) => updateUserRole({ userId, role }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setSelectedRole('');
            setShowRoleForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const addRoleMutation = useMutation({
        mutationFn: (role: UserRole) => addUserRole({ userId, role }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setSelectedRole('');
            setShowRoleForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeRoleMutation = useMutation({
        mutationFn: (role: UserRole) => removeUserRole({ userId, role }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setRoleToRemove(null);
        },
        onError: (error: Error) => {
            toast.error(error.message);
            setRoleToRemove(null);
        },
    });

    // Atualizar valores do form quando os dados do usuário carregarem
    React.useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                phone: user.phone,
                username: user.username,
                gender: user.gender,
                date_of_birth: user.date_of_birth,
                address: user.address,
            });
        }
    }, [user, form]);

    // Se está carregando ou há erro
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Carregando dados do usuário...</span>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Erro ao carregar dados do usuário</p>
                    <Button variant="outline">
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    // Extrair dados do usuário para a empresa atual
    const { userId: currentUserId, userRoles, primaryRole } = getCurrentUserData(user, currentCompanyMember?.company.id || '');

    // Handlers
    const handleUpdateUser = (data: EditUserFormData) => {
        updateUserMutation.mutate({ ...data, userId: currentUserId, primaryRole });
    };

    const handlePasswordReset = (data: PasswordFormData) => {
        passwordMutation.mutate({ ...data, userId: currentUserId, primaryRole });
    };

    const handleDelete = () => {
        deleteMutation.mutate({ userId: currentUserId, primaryRole });
    };

    const handleDeactivate = () => {
        deactivateMutation.mutate({ userId: currentUserId, primaryRole, currentActive: user.active });
    };

    const handleAddRole = () => {
        if (selectedRole) {
            addRoleMutation.mutate(selectedRole as UserRole);
        }
    };

    const handleRemoveRole = (role: UserRole) => {
        if (role === primaryRole && userRoles.length > 1) {
            // Se está removendo a role principal e há outras roles, pede confirmação
            setRoleToRemove(role);
        } else {
            // Remove diretamente
            removeRoleMutation.mutate(role);
        }
    };

    const confirmRemoveRole = () => {
        if (roleToRemove) {
            removeRoleMutation.mutate(roleToRemove);
            setRoleToRemove(null);
        }
    };

    // Permissions - usuário pode alterar senha se for ADMIN e o usuário alvo tem STUDENT ou TEACHER entre suas roles
    const canChangePassword = currentCompanyMember?.role === 'ADMIN' &&
        (userRoles.includes('STUDENT') || userRoles.includes('TEACHER'));
    const isCurrentUser = currentCompanyMember?.user_id === currentUserId;
    const isRoleMutationPending = updateRoleMutation.isPending || removeRoleMutation.isPending || addRoleMutation.isPending;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Editar Usuário</h2>
                    <p className="text-muted-foreground">
                        Edite as informações do usuário: {user.name}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSearchParams({ tab: 'list' })}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário principal */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome completo</Label>
                                        <Input
                                            id="name"
                                            {...form.register('name')}
                                            placeholder="Digite o nome completo"
                                        />
                                        <FormMessageError error={form.formState.errors?.name?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...form.register('email')}
                                            placeholder="Digite o email"
                                        />
                                        <FormMessageError error={form.formState.errors?.email?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            {...form.register('cpf')}
                                            placeholder="Digite o CPF"
                                            maxLength={11}
                                        />
                                        <FormMessageError error={form.formState.errors?.cpf?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input
                                            id="phone"
                                            {...form.register('phone')}
                                            placeholder="Digite o telefone"
                                        />
                                        <FormMessageError error={form.formState.errors?.phone?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nome de usuário</Label>
                                        <Input
                                            id="username"
                                            {...form.register('username')}
                                            placeholder="Digite o nome de usuário"
                                        />
                                        <FormMessageError error={form.formState.errors?.username?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gênero</Label>
                                        <Controller
                                            name="gender"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o gênero" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="M">Masculino</SelectItem>
                                                        <SelectItem value="F">Feminino</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FormMessageError error={form.formState.errors?.gender?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Data de nascimento</Label>
                                        <Controller
                                            name="date_of_birth"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                                            ) : (
                                                                <span>Selecione uma data</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                            initialFocus
                                                            locale={ptBR}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        <FormMessageError error={form.formState.errors?.date_of_birth?.message} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Endereço completo</Label>
                                    <Textarea
                                        id="address"
                                        {...form.register('address')}
                                        placeholder="Digite o endereço completo"
                                        rows={3}
                                    />
                                    <FormMessageError error={form.formState.errors?.address?.message} />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={updateUserMutation.isPending}
                                        className="min-w-32"
                                    >
                                        {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações laterais */}
                <div className="space-y-4">
                    {/* Alterar senha - apenas admin pode alterar senha de STUDENT e TEACHER */}
                    {canChangePassword && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Redefinir Senha
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!showPasswordForm ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Redefina a senha deste {userRoles.includes('STUDENT') ? 'estudante' : 'professor'}.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowPasswordForm(true)}
                                        >
                                            Redefinir Senha
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nova senha</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                {...passwordForm.register('newPassword')}
                                                placeholder="Digite a nova senha"
                                            />
                                            <FormMessageError error={passwordForm.formState.errors?.newPassword?.message} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                {...passwordForm.register('confirmPassword')}
                                                placeholder="Confirme a nova senha"
                                            />
                                            <FormMessageError error={passwordForm.formState.errors?.confirmPassword?.message} />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setShowPasswordForm(false);
                                                    passwordForm.reset();
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={passwordMutation.isPending}
                                            >
                                                {passwordMutation.isPending ? 'Redefinindo...' : 'Redefinir Senha'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Gerenciar Roles */}
                    {currentCompanyMember?.role === 'ADMIN' && !isCurrentUser && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Gerenciar Roles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Roles atuais */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Roles Atuais:</Label>
                                        <div className="space-y-2">
                                            {userRoles.map(role => (
                                                <div key={role} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                    <span className="text-sm font-medium">
                                                        {getRoleLabel(role)}
                                                        {role === primaryRole && (
                                                            <span className="ml-2 text-xs text-primary">(principal)</span>
                                                        )}
                                                    </span>
                                                    {userRoles.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveRole(role)}
                                                            disabled={isRoleMutationPending}
                                                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Adicionar nova role */}
                                    {userRoles.length < 3 && (
                                        <div className="space-y-3">
                                            {!showRoleForm ? (
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => setShowRoleForm(true)}
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Adicionar Role
                                                </Button>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="newRole">Nova Role</Label>
                                                        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | '')}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Selecione uma nova role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {!userRoles.includes('STUDENT') && (
                                                                    <SelectItem value="STUDENT">🎓 Estudante</SelectItem>
                                                                )}
                                                                {!userRoles.includes('TEACHER') && (
                                                                    <SelectItem value="TEACHER">👨‍🏫 Professor</SelectItem>
                                                                )}
                                                                {!userRoles.includes('ADMIN') && (
                                                                    <SelectItem value="ADMIN">👑 Administrador</SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setShowRoleForm(false);
                                                                setSelectedRole('');
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={handleAddRole}
                                                            disabled={!selectedRole || isRoleMutationPending}
                                                        >
                                                            {addRoleMutation.isPending ? 'Adicionando...' : 'Adicionar Role'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {userRoles.length === 3 && (
                                        <p className="text-sm text-muted-foreground text-center py-2">
                                            O usuário já possui todas as roles disponíveis.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Ações de usuário */}
                    {!isCurrentUser && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Ações do Usuário</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Ativar/Desativar */}
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleDeactivate}
                                    disabled={deactivateMutation.isPending}
                                >
                                    {user.active ? (
                                        <>
                                            <UserX className="h-4 w-4 mr-2" />
                                            {deactivateMutation.isPending ? 'Desativando...' : 'Desativar Usuário'}
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            {deactivateMutation.isPending ? 'Ativando...' : 'Ativar Usuário'}
                                        </>
                                    )}
                                </Button>

                                <Separator />

                                {/* Excluir */}
                                {!showDeleteConfirm ? (
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir Usuário
                                    </Button>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Tem certeza? Esta ação não pode ser desfeita.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowDeleteConfirm(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleDelete}
                                                disabled={deleteMutation.isPending}
                                            >
                                                {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* AlertDialog de confirmação para remoção de role principal */}
            <AlertDialog open={!!roleToRemove} onOpenChange={(open) => !open && setRoleToRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover Role Principal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você está removendo a role principal "{roleToRemove && getRoleLabel(roleToRemove)}".
                            Isso pode afetar as permissões do usuário.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRoleToRemove(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRemoveRole}
                            disabled={removeRoleMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {removeRoleMutation.isPending ? 'Removendo...' : 'Confirmar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}