import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCheck, Users, Search, X } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getCurrentCompanyId } from '@/lib/company-utils';
import { formatDate } from './../../lib/utils';
import { getRegistrations } from '@/services/registrations';
import { ToggleLockRegistrationForm } from './components/toggle-lock-registration-form';
import { DeleteRegistrationForm } from './components/delete-registration-form';
import { EditPriceForm } from './components/edit-price-form';

export function RegistrationsTablePage() {

    // Estados locais para filtros
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'locked'>('all');

    const { data, isPending, error } = useQuery({
        queryKey: ['registrations', getCurrentCompanyId()],
        queryFn: () => getRegistrations({ company_id: getCurrentCompanyId() }),
        enabled: !!getCurrentCompanyId(),
    });

    // Filtrar dados baseado nos filtros
    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter((registration) => {
            // Filtro de busca (nome do usuário)
            const matchesSearch = !searchFilter ||
                registration.users?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                registration.users?.email.toLowerCase().includes(searchFilter.toLowerCase());

            // Filtro de status
            let matchesStatus = true;
            if (statusFilter === 'active') {
                matchesStatus = !registration.completed && !registration.locked;
            } else if (statusFilter === 'completed') {
                matchesStatus = registration.completed === true;
            } else if (statusFilter === 'locked') {
                matchesStatus = registration.locked === true;
            }

            return matchesSearch && matchesStatus;
        });
    }, [data, searchFilter, statusFilter]);

    const clearFilters = () => {
        setSearchFilter('');
        setStatusFilter('all');
    };

    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Erro ao carregar Matrículas. Tente novamente.
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
                        Matrículas da Instituição ({filteredData.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Buscar por nome ou email do estudante"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="space-y-2 justify-end flex flex-col">
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'completed' | 'locked')}
                            >
                                <SelectTrigger id="status" className='w-full'>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="active">Ativas</SelectItem>
                                    <SelectItem value="completed">Concluídas</SelectItem>
                                    <SelectItem value="locked">Bloqueadas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="w-full"
                                disabled={!searchFilter && statusFilter === 'all'}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Matrículas */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background border-b">
                                <TableRow>
                                    <TableHead>Estudante</TableHead>
                                    <TableHead>Data de Início</TableHead>
                                    <TableHead>Data de Término</TableHead>
                                    <TableHead>Valor Mensal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {searchFilter || statusFilter !== 'all'
                                                ? "Nenhuma matrícula encontrada com os filtros aplicados"
                                                : "Nenhuma matrícula encontrada"
                                            }
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData?.map((registration) => (
                                        <TableRow key={registration.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                                    {registration.users?.name || 'Usuário não encontrado'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(registration.start_date)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(registration.end_date)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                R$ {Number(registration.monthly_fee_amount).toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {registration.completed ? (
                                                    <Badge variant="default">Concluída</Badge>
                                                ) : registration.locked ? (
                                                    <Badge variant="destructive">Bloqueada</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Ativa</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(registration.created_at)}
                                            </TableCell>
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

                                                        <EditPriceForm registration={registration} />
                                                        <ToggleLockRegistrationForm registration={registration} />
                                                        <DropdownMenuSeparator />
                                                        <DeleteRegistrationForm registration={registration} />
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