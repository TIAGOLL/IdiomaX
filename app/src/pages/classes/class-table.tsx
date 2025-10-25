import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Edit, Plus } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { formatDate } from '@/lib/utils';
import { getClass } from '@/services/class';
import { Can } from '@/lib/Can';

export function ClassTablePage() {
    const navigate = useNavigate();

    const { data, isPending, error } = useQuery({
        queryKey: ['class'],
        queryFn: () => getClass({
            company_id: getCurrentCompanyId(),
        }),
        enabled: !!getCurrentCompanyId(),
    });

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
                        Erro ao carregar cursos. Tente novamente.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                        <div className='flex items-center gap-2'>
                            <BookOpen className="size-5" />
                            Turmas ({data?.length})
                        </div>
                        <Can I="create" a="Class">
                            <Button
                                onClick={() => navigate('?tab=create')}
                                className="flex items-center gap-2"
                            >
                                <Plus className="size-4" />
                                Nova Turma
                            </Button>
                        </Can>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Tabela de turmas */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="border-b-1 border-b-white/50">
                                <TableRow>
                                    <TableHead>Nome da Turma</TableHead>
                                    <TableHead>Dias da Semana</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead className='flex flex-col items-center justify-center mb-1'>
                                        <span>Vagas</span>
                                        <span>(ocupadas/disponíveis)</span>
                                    </TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Nenhuma turma encontrada.
                                            <Can I="create" a="Class">
                                                <br />
                                                <Button
                                                    variant="link"
                                                    onClick={() => navigate('?tab=create')}
                                                    className="mt-2"
                                                >
                                                    Criar primeira turma
                                                </Button>
                                            </Can>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((classItem) => (
                                        <TableRow key={classItem.id}>
                                            <TableCell className="font-medium">
                                                {classItem.name}
                                            </TableCell>
                                            <TableCell>
                                                {classItem?.class_days?.map(cd => cd.week_date).join(', ')}
                                            </TableCell>
                                            <TableCell>
                                                {classItem.courses.name}
                                            </TableCell>
                                            <TableCell className='flex items-center justify-center'>
                                                {classItem._count.users_in_class}/{classItem.vacancies}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(classItem.created_at)}
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
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/classes?tab=edit&id=${classItem.id}`)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
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
        </div >
    );
}
