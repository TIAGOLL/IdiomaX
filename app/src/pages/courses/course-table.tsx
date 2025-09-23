import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Edit } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router';
import { getCourses } from '@/services/courses/get-courses';
import { getCurrentCompanyId } from '@/lib/company-utils';
import { formatDate } from './../../lib/utils';

export function CoursesTablePage() {
    const navigate = useNavigate();

    const { data, isPending, error } = useQuery({
        queryKey: ['courses', ],
        queryFn: () => getCourses({ company_id: getCurrentCompanyId() }),
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
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="size-5" />
                        Cursos da Instituição ({data?.length})
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Tabela de cursos */}
            <Card>
                <CardContent className="p-0">
                    <div className="max-h-[31rem] overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background border-b">
                                <TableRow>
                                    <TableHead>Nome do Curso</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Nenhum curso encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">
                                                {course.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate" title={course.description || ''}>
                                                    {course.description || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {course.active ? (
                                                    <Badge variant="default">Ativo</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Inativo</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(course?.created_at)}
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
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/courses?tab=edit&id=${course.id}`)}>
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
