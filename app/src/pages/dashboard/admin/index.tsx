import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Info, TriangleAlert } from "lucide-react";
import { getAdminDashboard } from "@/services/dashboard/admin";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSessionContext } from "@/contexts/session-context";

export function AdminDashboard() {
    const { getCompanyId } = useSessionContext();

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['admin-dashboard', getCompanyId()],
        queryFn: async () => {
            if (!getCompanyId()) return null;
            const res = await getAdminDashboard();
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
        <div className="w-11/12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 py-8">
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Calendário de Encontros</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Turma</TableHead>
                                <TableHead>Dia da Semana</TableHead>
                                <TableHead>Começo</TableHead>
                                <TableHead>Fim</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.classDays.map((day) => {
                                const initial = new Date(day.initial_date);
                                const final = new Date(day.final_date);
                                const pad = (n: number) => n.toString().padStart(2, "0");
                                const horaInicial = `${pad(initial.getHours())}:${pad(initial.getMinutes())}`;
                                const horaFinal = `${pad(final.getHours())}:${pad(final.getMinutes())}`;
                                // Dia da semana em português
                                const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                const diaSemana = diasSemana[initial.getDay()];
                                return (
                                    <TableRow key={day.id}>
                                        <TableCell>{day.className}</TableCell>
                                        <TableCell>{diaSemana}</TableCell>
                                        <TableCell>{horaInicial}</TableCell>
                                        <TableCell>{horaFinal}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Receitas a receber x Recebidas */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Receitas a Receber X Receitas recebidas</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        // Combine as curvas para o gráfico de barras
                        const barChartData = stats.receivablesCurve.map((item, idx) => ({
                            month: item.month,
                            aReceber: item.value,
                            recebidas: stats.receivedCurve[idx]?.value ?? 0,
                        }));

                        const chartConfig = {
                            aReceber: { label: "A Receber", color: "#2563eb" },
                            recebidas: { label: "Recebidas", color: "#22c55e" },
                        };

                        return (
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-24">
                                <BarChart data={barChartData}>
                                    <CartesianGrid vertical={true} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="aReceber" fill="#2563eb" name="A Receber" />
                                    <Bar dataKey="recebidas" fill="#22c55e" name="Recebidas" />
                                </BarChart>
                            </ChartContainer>
                        );
                    })()}
                </CardContent>
            </Card>

            {/* Visão executiva */}
            <Card className="col-span-3 sm:col-span-1">
                <CardHeader>
                    <CardTitle>Visão Executiva</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Alunos ativos</strong></TableCell>
                                <TableCell>{stats.activeStudents}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Matrículas novas (30d)</strong></TableCell>
                                <TableCell>{stats.newRegistrations}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Matrículas concluídas</strong></TableCell>
                                <TableCell>{stats.completedRegistrations}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Matrículas trancadas</strong></TableCell>
                                <TableCell>{stats.lockedRegistrations}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><strong>Ticket Médio por Matrícula</strong></TableCell>
                                <TableCell>R$ {stats.avgTicket}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Financeiro */}
            <Card className="col-span-3 shadow-lg sm:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold text-blue-700 dark:text-blue-200">
                                    <span className="flex flex-row gap-2 items-center">
                                        MRR devido:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <span>
                                                        Soma de todas as mensalidades <b>não pagas</b> (vencidas e a vencer).
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </TableCell>
                                <TableCell className="text-blue-700 dark:text-blue-200">R$ {stats.mrrDue}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold text-green-700 dark:text-green-200">
                                    <span className="flex flex-row gap-2 items-center">
                                        MRR recebido:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <span>
                                                        Soma de todas as mensalidades <b>já pagas</b>.
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </TableCell>
                                <TableCell className="text-green-700 dark:text-green-200">R$ {stats.mrrReceived}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold text-yellow-700 dark:text-yellow-200">
                                    <span className="flex flex-row gap-2 items-center">
                                        MRR aberto:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <span>
                                                        Soma de todas as mensalidades <b>não pagas e já vencidas</b>.
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </TableCell>
                                <TableCell className="text-yellow-700 dark:text-yellow-200">R$ {stats.mrrOpen}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    <span className="flex flex-row gap-2 items-center">
                                        DSO:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <span>
                                                        <b>Days Sales Outstanding</b>: média de dias para receber após o vencimento das mensalidades.
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </TableCell>
                                <TableCell>{stats.dso} dias</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    <span className="flex flex-row gap-2 items-center">
                                        Taxa de inadimplência:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <span>
                                                        Percentual de mensalidades vencidas que ainda <b>não foram pagas</b>.
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </span>
                                </TableCell>
                                <TableCell>{stats.defaultRate}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold align-top">Mensalidades em atraso (Em dias):</TableCell>
                                <TableCell>
                                    <ul className="ml-2 mt-1 text-sm">
                                        <li>0–30d: <span className="font-bold">R$ {stats.aging["0-30"]}</span></li>
                                        <li>31–60d: <span className="font-bold">R$ {stats.aging["31-60"]}</span></li>
                                        <li>61–90d: <span className="font-bold">R$ {stats.aging["61-90"]}</span></li>
                                        <li>90+d: <span className="font-bold">R$ {stats.aging["90+"]}</span></li>
                                    </ul>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold align-top">Métodos de pagamento utilizados:</TableCell>
                                <TableCell>
                                    {stats.paymentMix.map((item) => (
                                        <div key={item.method}>{item.method}: {item.percent}%</div>
                                    ))}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            {/* Ocupação média das turmas */}
            <Card className="col-span-3 sm:col-span-1">
                <CardHeader>
                    <CardTitle>Ocupação das Turmas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <strong>Média:</strong> {stats.avgClassOccupation}%
                        <Progress value={stats.avgClassOccupation} className="mt-2" />
                        <div className="mt-4">
                            <span className="text-xs">Baixa (&lt;60%): {stats.classOccupation.low}</span><br />
                            <span className="text-xs">Ideal (60–90%): {stats.classOccupation.ideal}</span><br />
                            <span className="text-xs">Alta (&gt;90%): {stats.classOccupation.high}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assiduidade média por turma */}
            <Card className="col-span-3 sm:col-span-1">
                <CardHeader>
                    <CardTitle>Assiduidade Média por Turma</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <strong>Média:</strong> {stats.avgAttendance}%
                        <Progress value={stats.avgAttendance} className="mt-2" />
                        <div className="mt-4 flex flex-row gap-2 justify-between items-center">
                            <div className="flex flex-col items-start">
                                <strong>Top 5 turmas:</strong>
                                <ul>
                                    {stats.topAttendanceClasses.map((c) => (
                                        <li key={c.id}>{c.nome}: {c.attendance}%</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col items-start">
                                <strong>Bottom 5 turmas:</strong>
                                <ul>
                                    {stats.bottomAttendanceClasses.map((c) => (
                                        <li key={c.id}>{c.nome}: {c.attendance}%</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Operação de turmas */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Operação de Turmas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Turma</TableHead>
                                <TableHead>Capacidade</TableHead>
                                <TableHead>Alunos</TableHead>
                                <TableHead>Ocupação</TableHead>
                                <TableHead>Curso</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.classes.map((turma) => (
                                <TableRow key={turma.id}>
                                    <TableCell>{turma.nome}</TableCell>
                                    <TableCell>{turma.vacancies}</TableCell>
                                    <TableCell>{turma.students}</TableCell>
                                    <TableCell>
                                        <Progress value={turma.occupation} />
                                        <span>{turma.occupation}%</span>
                                    </TableCell>
                                    <TableCell>{turma.courseName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Carga horária de professores */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Carga Horária dos Professores</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        const chartConfig = {
                            hours: {
                                label: "Horas",
                                color: "var(--color-primary)",
                            },
                        };
                        return (
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-48">
                                <BarChart data={stats.teacherWorkload}>
                                    <CartesianGrid vertical={true} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="hours" fill="var(--color-primary)" />
                                </BarChart>
                            </ChartContainer>
                        );
                    })()}
                </CardContent>
            </Card>
        </div>
    );
}