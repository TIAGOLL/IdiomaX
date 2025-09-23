import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Users, Edit, X } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from 'react-router';
import type { UserRole } from '@idiomax/http-schemas/users/get-users';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { getUsers } from '@/services/users/get-users';

export function UsersTablePage() {
    const navigate = useNavigate();

    // Estados locais para filtros (sem URL)
    const [searchFilter, setSearchFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');

    // Query única para buscar todos os usuários
    const usersQuery = useQuery({
        queryKey: ['users', 'ALL', getCurrentCompanyId()],
        queryFn: () => getUsers(undefined, { limit: 1000 }), // Buscar todos sem especificar role
        enabled: !!getCurrentCompanyId(),
    });

    const filteredUsers = useMemo(() => {
        if (!usersQuery.data?.users) return [];

        return usersQuery.data.users.filter(user => {
            // Filtro de busca (nome, email, username)
            const matchesSearch = !searchFilter ||
                user.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                user.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
                user.username.toLowerCase().includes(searchFilter.toLowerCase());

            // Filtro de role - extrair da relação member_on
            const userRole = user.member_on?.find(m => m.company_id === getCurrentCompanyId())?.role;
            const matchesRole = !roleFilter || userRole === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [usersQuery.data?.users, searchFilter, roleFilter]); const isLoading = usersQuery.isLoading;
    const hasError = usersQuery.error;

    const clearFilters = () => {
        setSearchFilter('');
        setRoleFilter('');
    };

    const handleEditUser = (userId: string) => {
        navigate(`/admin/users?tab=edit&id=${userId}`);
    };

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (hasError) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Erro ao carregar usuários. Tente novamente.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header com filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        Usuários da Instituição ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Buscar pornome, email ou usuário"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="space-y-2 justify-end flex flex-col">
                            <Select
                                value={roleFilter || "ALL"}
                                onValueChange={(value) => setRoleFilter(value === "ALL" ? "" : value as UserRole)}
                            >
                                <SelectTrigger id="role" className='w-full'>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos</SelectItem>
                                    <SelectItem value="STUDENT">Estudantes</SelectItem>
                                    <SelectItem value="TEACHER">Professores</SelectItem>
                                    <SelectItem value="ADMIN">Administradores</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="w-full"
                                disabled={!searchFilter && !roleFilter}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de usuários com scroll */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background border-b">
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Funções</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {searchFilter || roleFilter
                                                ? "Nenhum usuário encontrado com os filtros aplicados"
                                                : "Nenhum usuário encontrado"
                                            }
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.email}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.member_on.map(item => (
                                                    <Badge
                                                        key={item.role}
                                                        variant={item.role === 'ADMIN' ? 'destructive' : item.role === 'TEACHER' ? 'outline' : 'default'} className="mr-1">
                                                        {item.role == 'ADMIN' && 'Administrador'}
                                                        {item.role == 'TEACHER' && 'Professor'}
                                                        {item.role == 'STUDENT' && 'Estudante'}
                                                    </Badge>
                                                ))}
                                            </TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>
                                                {user.active ? (
                                                    <Badge variant="default">Ativo</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Inativo</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <DotsHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {user.member_on?.find(e => e.company_id === getCurrentCompanyId())?.role !== 'ADMIN' &&
                                                            <DropdownMenuItem onClick={() => handleEditUser(user.member_on.find(m => m.company_id === getCurrentCompanyId())?.user_id || '')}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                        }
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}