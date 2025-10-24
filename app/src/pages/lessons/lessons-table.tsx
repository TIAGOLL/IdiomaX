import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Plus, Calendar } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { formatDate } from '@/lib/utils';
import { getLessons } from '@/services/lessons';

export function LessonsTablePage() {
    const navigate = useNavigate();

    const { data, isPending, error } = useQuery({
        queryKey: ['lessons', getCurrentCompanyId()],
        queryFn: () => getLessons({
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
                        Erro ao carregar aulas. Tente novamente.
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
                            <Calendar className="size-5" />
                            Aulas ({data?.length})
                        </div>
                        <Button
                            onClick={() => navigate('?tab=create')}
                            className="flex items-center gap-2"
                        >
                            <Plus className="size-4" />
                            Nova Aula
                        </Button>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Tabela de aulas */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="border-b-1 border-b-white/50">
                                <TableRow>
                                    <TableHead>Tema da Aula</TableHead>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Data/Hora</TableHead>
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Nenhuma aula encontrada.
                                            <br />
                                            <Button
                                                variant="link"
                                                onClick={() => navigate('?tab=create')}
                                                className="mt-2"
                                            >
                                                Criar primeira aula
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.map((lesson) => (
                                        <TableRow key={lesson.id}>
                                            <TableCell className="font-medium">
                                                {lesson.theme}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {lesson.class.name}
                                            </TableCell>
                                            <TableCell>
                                                {lesson.class.courses.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{formatDate(lesson.start_date)}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(lesson.start_date).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} - {new Date(lesson.end_date).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <DotsHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`?tab=edit&id=${lesson.id}`)}
                                                        >
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
        </div>
    );
}