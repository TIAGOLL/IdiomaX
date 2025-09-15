import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { useSession } from "@/hooks/use-session";
import { TriangleAlert } from "lucide-react";
import { getAdminDashboard } from "@/services/dashboard/admin";
import { formatDate } from "@/lib/utils";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminDashboard() {
    const { currentCompanyMember } = useSession();

    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['admin-dashboard', currentCompanyMember?.id],
        queryFn: async () => {
            const res = await getAdminDashboard(currentCompanyMember?.company_id);
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
            {/* Calendário de encontros */}
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Calendário de Encontros</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Turma</TableHead>
                                <TableHead>Data Inicial</TableHead>
                                <TableHead>Hora Inicial</TableHead>
                                <TableHead>Data Final</TableHead>
                                <TableHead>Hora Final</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.classDays.map((day) => {
                                const initial = new Date(day.initial_date);
                                const final = new Date(day.final_date);
                                const pad = (n: number) => n.toString().padStart(2, "0");
                                const horaInicial = `${pad(initial.getHours())}:${pad(initial.getMinutes())}`;
                                const horaFinal = `${pad(final.getHours())}:${pad(final.getMinutes())}`;
                                return (
                                    <TableRow key={day.id}>
                                        <TableCell>{day.className}</TableCell>
                                        <TableCell>{formatDate(day.initial_date)}</TableCell>
                                        <TableCell>{horaInicial}</TableCell>
                                        <TableCell>{formatDate(day.final_date)}</TableCell>
                                        <TableCell>{horaFinal}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Ocupação média das turmas */}
            <Card>
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
            <Card>
                <CardHeader>
                    <CardTitle>Assiduidade Média por Turma</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <strong>Média:</strong> {stats.avgAttendance}%
                        <Progress value={stats.avgAttendance} className="mt-2" />
                        <div className="mt-4">
                            <strong>Top 5 turmas:</strong>
                            <ul>
                                {stats.topAttendanceClasses.map((c) => (
                                    <li key={c.id}>{c.nome}: {c.attendance}%</li>
                                ))}
                            </ul>
                            <strong>Bottom 5 turmas:</strong>
                            <ul>
                                {stats.bottomAttendanceClasses.map((c) => (
                                    <li key={c.id}>{c.nome}: {c.attendance}%</li>
                                ))}
                            </ul>
                        </div>
                    </div>
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
                                color: "#8884d8",
                            },
                        };
                        return (
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-48">
                                <BarChart data={stats.teacherWorkload}>
                                    <CartesianGrid vertical={true} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                    <Bar dataKey="hours" fill="#8884d8" />
                                </BarChart>
                            </ChartContainer>
                        );
                    })()}
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

            {/* Visão executiva */}
            <Card>
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
            <Card className="col-span-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold text-blue-200">MRR devido:</TableCell>
                                <TableCell className="text-blue-200">R$ {stats.mrrDue}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold text-green-200">MRR recebido:</TableCell>
                                <TableCell className="text-green-200">R$ {stats.mrrReceived}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold text-yellow-200">MRR aberto:</TableCell>
                                <TableCell className="text-yellow-200">R$ {stats.mrrOpen}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">DSO:</TableCell>
                                <TableCell>{stats.dso} dias</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">Taxa de inadimplência:</TableCell>
                                <TableCell>{stats.defaultRate}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold align-top">Aging de títulos:</TableCell>
                                <TableCell>
                                    <ul className="ml-2 mt-1 text-sm">
                                        <li>0–30d: <span className="font-bold text-blue-400">R$ {stats.aging["0-30"]}</span></li>
                                        <li>31–60d: <span className="font-bold text-blue-400">R$ {stats.aging["31-60"]}</span></li>
                                        <li>61–90d: <span className="font-bold text-blue-400">R$ {stats.aging["61-90"]}</span></li>
                                        <li>90+d: <span className="font-bold text-blue-400">R$ {stats.aging["90+"]}</span></li>
                                    </ul>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold align-top">Métodos de pagamento utilizados:</TableCell>
                                <TableCell>
                                    {stats.paymentMix.map((item) => (
                                        <div>{item.method}: {item.percent}%</div>
                                    ))}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Receitas a Receber</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        const chartConfig = {
                            value: {
                                label: "Receitas",
                                color: "#2563eb",
                            },
                        };
                        return (
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-24">
                                <LineChart data={stats.receivablesCurve}>
                                    <CartesianGrid vertical={true} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent nameKey="month" />} />
                                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ChartContainer>
                        );
                    })()}
                </CardContent>
            </Card>
        </div>
    );
}