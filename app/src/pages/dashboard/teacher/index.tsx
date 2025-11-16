import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TriangleAlert, Users, BookOpen, Calendar } from "lucide-react";
import { getTeacherDashboard } from "@/services/dashboard/teacher";
import { useSessionContext } from "@/contexts/session-context";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export function TeacherDashboard() {
    const { getCompanyId } = useSessionContext();

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['teacher-dashboard', getCompanyId()],
        queryFn: async () => {
            if (!getCompanyId()) return null;
            const res = await getTeacherDashboard();
            return res;
        },
    });

    // Agrupar aulas por dia
    const calendarData = useMemo(() => {
        if (!stats) return [];

        const grouped = new Map<string, typeof stats.scheduledClasses>();

        stats.scheduledClasses.forEach((classItem) => {
            const date = new Date(classItem.start);
            const dateKey = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }
            grouped.get(dateKey)!.push(classItem);
        });

        // Converter para array e ordenar por data
        return Array.from(grouped.entries())
            .map(([date, classes]) => ({
                date,
                classes: classes.sort(
                    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
                ),
            }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            });
    }, [stats]);

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
            {/* Card 1: Minhas Turmas */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Minhas Turmas ({stats.myClasses.length})</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto flex flex-col">
                        {stats.myClasses.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                                Você não está associado a nenhuma turma
                            </p>
                        ) : (
                            stats.myClasses.map((classItem) => (
                                <Link
                                    key={classItem.id}
                                    to={`/admin/classes/${classItem.id}?company=${getCompanyId()}`}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left h-auto py-2 px-3"
                                    >
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="font-semibold text-sm">
                                                {classItem.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {classItem.courseName} • {classItem.studentsCount}/{classItem.vacancies} alunos
                                            </span>
                                        </div>
                                    </Button>
                                </Link>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Total de Alunos */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex m-auto flex-col justify-center items-center">
                    <div className="text-5xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.totalStudents === 1 ? 'Aluno matriculado' : 'Alunos matriculados'} em suas turmas
                    </p>
                </CardContent>
            </Card>

            {/* Card 3: Aulas Próximas (7 dias) */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aulas nos próximos 7 dias</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex m-auto flex-col justify-center items-center">
                    <div className="text-5xl font-bold">{stats.upcomingLessons}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.upcomingLessons === 1 ? 'Aula agendada' : 'Aulas agendadas'} nos próximos 7 dias
                    </p>
                </CardContent>
            </Card>

            {/* Calendário de Aulas */}
            <Card className="col-span-1 md:col-span-3 shadow-lg">
                <CardHeader>
                    <CardTitle>Calendário de Aulas</CardTitle>
                </CardHeader>
                <CardContent>
                    {calendarData.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Não há aulas agendadas nos próximos 7 dias.
                        </p>
                    ) : (
                        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {calendarData.map((day) => (
                                <div key={day.date} className="border rounded-lg p-4 h-full">
                                    <h3 className="text-lg font-semibold mb-3">
                                        {day.date}
                                    </h3>
                                    <div className="space-y-2">
                                        {day.classes.map((classItem) => {
                                            const startTime = new Date(classItem.start);
                                            const endTime = new Date(classItem.end);
                                            const formatTime = (date: Date) => {
                                                const hours = date.getHours().toString().padStart(2, '0');
                                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                                return `${hours}:${minutes}`;
                                            };

                                            return (
                                                <div
                                                    key={classItem.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium">
                                                            {classItem.className}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {classItem.courseName}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {formatTime(startTime)} - {formatTime(endTime)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
