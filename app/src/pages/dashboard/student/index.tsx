import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TriangleAlert, BookOpen, ClipboardList, Award } from "lucide-react";
import { getStudentDashboard } from "@/services/dashboard/student";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { useSessionContext } from "@/contexts/session-context";

export function StudentDashboard() {
    const { getCompanyId } = useSessionContext();

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['student-dashboard', getCompanyId()],
        queryFn: async () => {
            if (!getCompanyId()) return null;
            const res = await getStudentDashboard();
            return res;
        },
    });

    if (isLoading) return <div className="p-8">Carregando...</div>;
    if (error) return (
        <Card className="max-w-md mx-auto mt-16 border-red-400 bg-red-50">
            <CardHeader>
                <CardTitle className="text-red-600 flex-row flex items-center gap-2">
                    <TriangleAlert /> Erro ao carregar dashboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-red-500">
                    Ocorreu um problema ao buscar os dados.<br />
                    Tente novamente mais tarde ou contate o suporte.
                </div>
            </CardContent>
        </Card>
    );
    if (!stats) return null;

    return (
        <div className="w-11/12 grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            {/* Card 1: Taxa de Presença */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Sua frequência nas aulas
                    </p>
                </CardContent>
            </Card>

            {/* Card 2: Atividades Pendentes */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Atividades Pendentes</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.pendingTasks === 1 ? 'Atividade a entregar' : 'Atividades a entregar'}
                    </p>
                </CardContent>
            </Card>

            {/* Card 3: Níveis Finalizados */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Níveis Finalizados</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completedLevels}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.completedLevels === 1 ? 'Curso concluído' : 'Cursos concluídos'}
                    </p>
                </CardContent>
            </Card>

            {/* Tabela de Próximas Aulas */}
            <Card className="col-span-1 md:col-span-3 shadow-lg">
                <CardHeader>
                    <CardTitle>Próximas Aulas</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.upcomingClasses.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Não há aulas agendadas no momento.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Dia da Semana</TableHead>
                                    <TableHead>Horário</TableHead>
                                    <TableHead>Próxima Data</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.upcomingClasses.map((classItem) => {
                                    const nextDate = new Date(classItem.nextDate);
                                    const formattedDate = nextDate.toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    });

                                    return (
                                        <TableRow key={classItem.id}>
                                            <TableCell className="font-medium">{classItem.className}</TableCell>
                                            <TableCell>{classItem.courseName}</TableCell>
                                            <TableCell>{classItem.dayOfWeek}</TableCell>
                                            <TableCell>{classItem.startTime} - {classItem.endTime}</TableCell>
                                            <TableCell>{formattedDate}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
