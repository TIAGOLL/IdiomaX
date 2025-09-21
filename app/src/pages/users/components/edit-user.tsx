import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormMessageError } from '@/components/ui/form-message-error';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Key, Trash2, UserCheck, UserX, X, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateUser, adminResetPassword, deleteUser, deactivateUser } from '@/services/users';
import { updateUserRole } from '@/services/users/manage-roles';
import { useSessionContext } from '@/contexts/session-context';
import type { UserWithRole } from '@idiomax/http-schemas/get-users';
import { editUserFormSchema, adminPasswordResetFormSchema } from '@idiomax/http-schemas/edit-user-form';
import type { EditUserFormData as EditFormData, AdminPasswordResetFormData } from '@idiomax/http-schemas/edit-user-form';

// Schema para edição de usuário baseado nas entities
const editUserSchema = editUserFormSchema;

// Schema para alteração de senha baseado no schema oficial
const passwordSchema = adminPasswordResetFormSchema;

type EditUserFormData = EditFormData;
type PasswordFormData = AdminPasswordResetFormData;

interface EditUserProps {
    user: UserWithRole;
    onClose: () => void;
}

export function EditUser({ user, onClose }: EditUserProps) {
    const { currentCompanyMember } = useSessionContext();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN' | ''>('');
    const queryClient = useQueryClient();

    // Form para edição de dados básicos
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            phone: user.phone,
            username: user.username,
            gender: user.gender,
            date_of_birth: new Date(user.date_of_birth),
            address: user.address,
            role: user.role,
        },
    });

    // Form para alteração de senha
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    // Mutation para atualizar usuário
    const updateUserMutation = useMutation({
        mutationFn: (data: EditUserFormData) => updateUser(user.role, {
            ...data,
            id: user.id,
            companyId: currentCompanyMember?.company.id || ''
        }),
        onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao atualizar usuário');
        },
    });

    // Mutation para redefinir senha (admin resetando senha de aluno/professor)
    const passwordMutation = useMutation({
        mutationFn: (data: PasswordFormData) => adminResetPassword(user.role, user.id, data.newPassword),
        onSuccess: () => {
            toast.success('Senha redefinida com sucesso!');
            resetPasswordForm();
            setShowPasswordForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Mutation para excluir usuário
    const deleteMutation = useMutation({
        mutationFn: () => deleteUser(user.role, user.id),
        onSuccess: () => {
            toast.success('Usuário excluído com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Erro ao excluir usuário');
        },
    });

    // Mutation para ativar/desativar usuário
    const deactivateMutation = useMutation({
        mutationFn: () => deactivateUser(user.role, user.id, !user.active),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    // Mutation para alterar role
    const updateRoleMutation = useMutation({
        mutationFn: (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => updateUserRole({ userId: user.id, role }),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setSelectedRole('');
            setShowRoleForm(false);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: EditUserFormData) => {
        updateUserMutation.mutate(data);
    };

    const onSubmitPassword = (data: PasswordFormData) => {
        passwordMutation.mutate(data);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    const handleDeactivate = () => {
        deactivateMutation.mutate();
    };

    const handleUpdateRole = () => {
        if (selectedRole) {
            updateRoleMutation.mutate(selectedRole);
        }
    };

    const canChangePassword = currentCompanyMember?.role === 'ADMIN' && (user.role === 'STUDENT' || user.role === 'TEACHER');
    const isCurrentUser = currentCompanyMember?.user_id === user.id;

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
                <Button variant="outline" size="sm" onClick={onClose}>
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
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome completo</Label>
                                        <Input
                                            id="name"
                                            {...register('name')}
                                            placeholder="Digite o nome completo"
                                        />
                                        <FormMessageError error={errors?.name?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            placeholder="Digite o email"
                                        />
                                        <FormMessageError error={errors?.email?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            {...register('cpf')}
                                            placeholder="Digite o CPF"
                                            maxLength={11}
                                        />
                                        <FormMessageError error={errors?.cpf?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input
                                            id="phone"
                                            {...register('phone')}
                                            placeholder="Digite o telefone"
                                        />
                                        <FormMessageError error={errors?.phone?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nome de usuário</Label>
                                        <Input
                                            id="username"
                                            {...register('username')}
                                            placeholder="Digite o nome de usuário"
                                        />
                                        <FormMessageError error={errors?.username?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Tipo de usuário</Label>
                                        <Controller
                                            name="role"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="STUDENT">Estudante</SelectItem>
                                                        <SelectItem value="TEACHER">Professor</SelectItem>
                                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FormMessageError error={errors?.role?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gênero</Label>
                                        <Controller
                                            name="gender"
                                            control={control}
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
                                        <FormMessageError error={errors?.gender?.message} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Data de nascimento</Label>
                                        <Controller
                                            name="date_of_birth"
                                            control={control}
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
                                        <FormMessageError error={errors?.date_of_birth?.message} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Endereço completo</Label>
                                    <Textarea
                                        id="address"
                                        {...register('address')}
                                        placeholder="Digite o endereço completo"
                                        rows={3}
                                    />
                                    <FormMessageError error={errors?.address?.message} />
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
                                            Redefina a senha deste {user.role === 'STUDENT' ? 'estudante' : 'professor'}.
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
                                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nova senha</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                {...registerPassword('newPassword')}
                                                placeholder="Digite a nova senha"
                                            />
                                            <FormMessageError error={passwordErrors?.newPassword?.message} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                {...registerPassword('confirmPassword')}
                                                placeholder="Confirme a nova senha"
                                            />
                                            <FormMessageError error={passwordErrors?.confirmPassword?.message} />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setShowPasswordForm(false);
                                                    resetPasswordForm();
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
                                    Alterar Role
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Role atual */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Role Atual:</Label>
                                        <div className="flex items-center justify-center p-3 bg-muted rounded-md">
                                            <span className="text-sm font-medium">
                                                {user.role === 'STUDENT' && '🎓 Estudante'}
                                                {user.role === 'TEACHER' && '👨‍🏫 Professor'}
                                                {user.role === 'ADMIN' && '👑 Administrador'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Alterar role */}
                                    {!showRoleForm ? (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowRoleForm(true)}
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            Alterar Role
                                        </Button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="newRole">Nova Role</Label>
                                                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'STUDENT' | 'TEACHER' | 'ADMIN' | '')}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma nova role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {user.role !== 'STUDENT' && (
                                                            <SelectItem value="STUDENT">🎓 Estudante</SelectItem>
                                                        )}
                                                        {user.role !== 'TEACHER' && (
                                                            <SelectItem value="TEACHER">👨‍🏫 Professor</SelectItem>
                                                        )}
                                                        {user.role !== 'ADMIN' && (
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
                                                    onClick={handleUpdateRole}
                                                    disabled={!selectedRole || updateRoleMutation.isPending}
                                                >
                                                    {updateRoleMutation.isPending ? 'Alterando...' : 'Alterar Role'}
                                                </Button>
                                            </div>
                                        </div>
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
        </div>
    );
}