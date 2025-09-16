import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "@/middlewares/auth";
import { ForbiddenError } from "../_errors/forbidden-error";

export async function AdminDashboard(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .get(
            "/admin-dashboard/:company",
            {
                schema: {
                    tags: ["Dashboard"],
                    summary: "Dashboard administrativa filtrada por empresa",
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        company: z.string(),
                    }),
                    querystring: z.object({
                        receivablesCurveYear: z.number().min(2000).max(2100).default(new Date().getFullYear()),
                    }),
                    response: {
                        200: z.object({
                            activeStudents: z.number(),
                            newRegistrations: z.number(),
                            completedRegistrations: z.number(),
                            avgClassOccupation: z.number(),
                            classOccupation: z.object({
                                low: z.number(),
                                ideal: z.number(),
                                high: z.number(),
                            }),
                            avgAttendance: z.number(),
                            topAttendanceClasses: z.array(z.object({ id: z.string(), nome: z.string(), attendance: z.number() })),
                            bottomAttendanceClasses: z.array(z.object({ id: z.string(), nome: z.string(), attendance: z.number() })),
                            teacherWorkload: z.array(z.object({ name: z.string(), hours: z.number() })),
                            classes: z.array(z.object({
                                id: z.string(),
                                nome: z.string(),
                                vacancies: z.number(),
                                students: z.number(),
                                occupation: z.number(),
                                courseName: z.string(),
                            })),
                            classDays: z.array(z.object({
                                id: z.string(),
                                className: z.string(),
                                initial_date: z.date(),
                                final_date: z.date(),
                            })),
                            alertLowOccupation: z.array(z.object({
                                id: z.string(),
                                nome: z.string(),
                                occupation: z.number(),
                            })),
                            lockedRegistrations: z.number(),
                            alertHighOccupation: z.array(z.object({
                                id: z.string(),
                                nome: z.string(),
                                occupation: z.number(),
                            })),
                            mrrDue: z.number(),
                            mrrReceived: z.number(),
                            mrrOpen: z.number(),
                            aging: z.object({
                                "0-30": z.number(),
                                "31-60": z.number(),
                                "61-90": z.number(),
                                "90+": z.number(),
                            }),
                            dso: z.number(),
                            defaultRate: z.number(),
                            receivablesCurve: z.array(z.object({ month: z.string(), value: z.number() })),
                            receivedCurve: z.array(z.object({ month: z.string(), value: z.number() })),
                            earlyDiscount: z.number(),
                            paymentMix: z.array(z.object({ method: z.string(), percent: z.number() })),
                            avgTicket: z.number(),
                            registrations: z.array(z.object({
                                id: z.string(),
                                locked: z.boolean(),
                                completed: z.boolean(),
                                daysSinceStart: z.number(),
                                monthly_fee_amount: z.number().nullable(),
                            })),
                            lowAttendanceStudents: z.array(z.object({
                                id: z.string(),
                                name: z.string(),
                                attendance: z.number(),
                            })),
                            classMeetings: z.array(z.object({
                                classId: z.string(),
                                className: z.string(),
                                scheduled: z.number(),
                                done: z.number(),
                            })),
                            tasksByDiscipline: z.array(z.object({
                                disciplineId: z.string(),
                                disciplineName: z.string(),
                                deliveries: z.number(),
                            })),
                            pendingTasks: z.array(z.object({
                                period: z.string(),
                                count: z.number(),
                            })),
                        }),
                        403: z.object({ message: z.string() }),
                        500: z.object({ message: z.string() })
                    },
                },
            },
            async (request, reply) => {
                const { receivablesCurveYear } = request.query
                const { company } = request.params;
                const userId = await request.getCurrentUserId();

                // Verifica se o usuário é ADMIN na empresa
                const member = await prisma.members.findFirst({
                    where: {
                        user_id: userId,
                        company_id: company,
                        role: "ADMIN",
                    },
                });
                if (!member) {
                    throw new ForbiddenError();
                }

                // Visão executiva
                const activeStudents = await prisma.users.count({
                    where: {
                        active: true,
                        member_on: { some: { company_id: company, role: "STUDENT" } },
                        registrations: { some: { companies_id: company, completed: false } },
                    },
                });
                const newRegistrations = await prisma.registrations.count({
                    where: {
                        start_date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                        companies_id: company,
                    },
                });
                const completedRegistrations = await prisma.registrations.count({
                    where: { completed: true, companies_id: company },
                });

                //locked registrations
                const lockedRegistrations = await prisma.registrations.count({
                    where: { locked: true, companies_id: company },
                });

                // Ocupação média das turmas
                const classes = await prisma.renamedclass.findMany({
                    where: { courses: { companies_id: company } },
                    include: { users_in_class: true, courses: true },
                });
                const classStats = classes.map(c => {
                    const students = c.users_in_class.length;
                    const vacancies = Number(c.vacancies);
                    const occupation = vacancies ? Math.round((students / vacancies) * 100) : 0;
                    return { id: c.id, nome: c.nome, vacancies, students, occupation, courseName: c.courses.name };
                });
                const avgClassOccupation = Math.round(
                    classStats.reduce((acc, c) => acc + c.occupation, 0) / (classStats.length || 1)
                );
                const classOccupation = {
                    low: classStats.filter(c => c.occupation < 60).length,
                    ideal: classStats.filter(c => c.occupation >= 60 && c.occupation <= 90).length,
                    high: classStats.filter(c => c.occupation > 90).length,
                };

                // Assiduidade média por turma
                const attendanceByClass = await prisma.renamedclass.findMany({
                    where: { courses: { companies_id: company } },
                    include: {
                        users_in_class: {
                            include: {
                                users: {
                                    include: {
                                        presence_list: true
                                    }
                                },
                            },
                        },
                    },
                });
                const attendanceStats = attendanceByClass.map(c => {
                    const totalStudents = c.users_in_class.length;
                    // Encontros únicos da turma (cada classes_id representa uma aula)
                    const allPresences = c.users_in_class.flatMap(uic => uic.users.presence_list);
                    const uniqueMeetings = Array.from(new Set(allPresences.map(p => p.classes_id)));
                    const totalMeetings = uniqueMeetings.length;

                    // Para cada aluno, conta em quantas aulas ele esteve presente (1 presença por aula)
                    let totalAttendancePercent = 0;
                    for (const uic of c.users_in_class) {
                        const uniqueStudentMeetings = new Set(uic.users.presence_list.map(p => p.classes_id));
                        const studentAttendance = totalMeetings
                            ? (uniqueStudentMeetings.size / totalMeetings) * 100
                            : 0;
                        totalAttendancePercent += studentAttendance;
                    }

                    // Média da turma
                    const attendance = totalStudents
                        ? Math.round(totalAttendancePercent / totalStudents)
                        : 0;

                    return { id: c.id, nome: c.nome, attendance };
                });
                const avgAttendance = Math.round(
                    attendanceStats.reduce((acc, c) => acc + c.attendance, 0) / (attendanceStats.length || 1)
                );
                const topAttendanceClasses = attendanceStats.sort((a, b) => b.attendance - a.attendance).slice(0, 5);
                const bottomAttendanceClasses = attendanceStats.sort((a, b) => a.attendance - b.attendance).slice(0, 5);

                // Carga horária de professores
                const teachers = await prisma.users.findMany({
                    where: {
                        member_on: { some: { company_id: company } },
                        users_in_class: {
                            some: {
                                teacher: true, class: {
                                    classes: {
                                        some: {}
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        users_in_class: {
                            where: { teacher: true, },
                            include: {
                                class: {
                                    include: {
                                        classes: true
                                    }
                                }
                            }
                        }
                    }
                });
                const teacherWorkload = teachers.map(t => {
                    // Soma as horas trabalhadas
                    let hours = 0;
                    for (const uic of t.users_in_class) {
                        for (const cd of uic.class.classes) {
                            const start = new Date(cd.start_date).getTime();
                            const end = new Date(cd.end_date).getTime();
                            hours += (end - start) / (1000 * 60 * 60);
                        }
                    }
                    return { name: t.name, hours: Math.round(hours) };
                });

                // Calendário de encontros (classes)
                const classDays = await prisma.classes.findMany({
                    where: { class: { courses: { companies_id: company } } },
                    include: { class: true },
                });
                const classDaysList = classDays.map(cd => ({
                    id: cd.id,
                    className: cd.class.nome,
                    initial_date: cd.start_date,
                    final_date: cd.end_date,
                }));

                // Alertas de ocupação
                const now = new Date();
                const alertLowOccupation = classStats.filter(c => {
                    const turma = classDays.find(cd => cd.class_id === c.id);
                    if (!turma) return false;
                    const diffDays = (new Date(turma.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                    return c.occupation < 60 && diffDays <= 7 && diffDays >= 0;
                });
                const alertHighOccupation = classStats.filter(c => c.occupation > 95);

                // Financeiro
                const monthlyFees = await prisma.monthly_fee.findMany({
                    where: {
                        registrations: {
                            companies_id: company
                        }
                    },
                });
                const mrrDue = monthlyFees.filter(f => !f.paid).reduce((acc, f) => acc + Number(f.value), 0);
                const mrrReceived = monthlyFees.filter(f => f.paid).reduce((acc, f) => acc + Number(f.value), 0);
                const mrrOpen = monthlyFees.filter(f => !f.paid && new Date(f.due_date) < now).reduce((acc, f) => acc + Number(f.value), 0);

                // Aging de títulos
                const aging = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
                monthlyFees.forEach(f => {
                    if (!f.paid) {
                        const diff = (now.getTime() - new Date(f.due_date).getTime()) / (1000 * 60 * 60 * 24);
                        if (diff < 0) return;
                        if (diff <= 30) aging["0-30"] += Number(f.value);
                        else if (diff <= 60) aging["31-60"] += Number(f.value);
                        else if (diff <= 90) aging["61-90"] += Number(f.value);
                        else aging["90+"] += Number(f.value);
                    }
                });

                // DSO
                const paidFees = monthlyFees.filter(f => f.paid);
                const dso = paidFees.length
                    ? Math.round(
                        paidFees.reduce((acc, f) => acc + ((new Date(f.date_of_payment).getTime() - new Date(f.due_date).getTime()) / (1000 * 60 * 60 * 24)), 0) /
                        paidFees.length
                    )
                    : 0;

                // Taxa de inadimplência
                const vencidas = monthlyFees.filter(f => !f.paid && new Date(f.due_date) < now);
                const totalVencidas = monthlyFees.filter(f => new Date(f.due_date) < now).length;

                const defaultRate = totalVencidas
                    ? Math.round((vencidas.length / totalVencidas) * 100)
                    : 0;

                // Curva de recebimentos (por mês)

                // Gera todos os meses do ano selecionado
                const monthsOfYear = Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, "0");
                    return `${receivablesCurveYear}-${month}`;
                });

                // Inicializa a curva com todos os meses do ano
                let receivablesCurve = monthsOfYear.map(month => ({
                    month,
                    value: 0
                }));

                // Soma valores pagos e a receber para cada mês
                monthlyFees.forEach(f => {
                    const month = new Date(f.due_date).toISOString().slice(0, 7);
                    if (month.startsWith(`${receivablesCurveYear}-`)) {
                        const rc = receivablesCurve.find(rc => rc.month === month);
                        if (rc) rc.value += Number(f.value);
                    }
                });

                // Ajusta o formato do mês para MM/YYYY
                receivablesCurve = receivablesCurve.map(item => {
                    const [year, month] = item.month.split("-");
                    return {
                        month: `${month}/${year}`,
                        value: item.value
                    };
                });

                // Desconto efetivo por pagamento antecipado
                const earlyDiscount = monthlyFees.filter(f => f.discount_payment_before_due_date).reduce((acc, f) => acc + Number(f.discount_payment_before_due_date), 0);

                // Mix de métodos de pagamento
                const paymentMix: any = {};
                monthlyFees.forEach(f => {
                    paymentMix[f.payment_method] = (paymentMix[f.payment_method] || 0) + 1;
                });
                const paymentMixArr = Object.entries(paymentMix).map(([method, count]) => ({
                    method,
                    percent: Math.round((count as number / monthlyFees.length) * 100),
                }));

                // Ticket médio por matrícula
                const registrations = await prisma.registrations.findMany({
                    where: { companies_id: company },
                });
                const avgTicket =
                    registrations.length
                        ? Math.round(
                            registrations.reduce((acc, r) => acc + Number(r.monthly_fee_amount || 0), 0) / registrations.length
                        )
                        : 0;

                // Matrículas administrativas
                const registrationsList = registrations.map(r => ({
                    id: r.id,
                    locked: r.locked,
                    completed: r.completed,
                    daysSinceStart: Math.round((now.getTime() - new Date(r.start_date).getTime()) / (1000 * 60 * 60 * 24)),
                    monthly_fee_amount: r.monthly_fee_amount ? Number(r.monthly_fee_amount) : null,
                }));

                // Presença e rotinas (exemplo: alunos <75% nas últimas 4 semanas)
                const lowAttendanceStudents: any[] = [];
                // Implemente conforme sua estrutura de presença

                // Encontros programados vs realizados
                const classMeetings: any[] = [];
                // Implemente conforme sua estrutura de classes/class_days

                // Tarefas
                const tasksByDiscipline: any[] = [];
                // Implemente conforme sua estrutura de tasks/tasks_delivery
                const pendingTasks: any[] = [];
                // Implemente conforme sua estrutura de tasks

                // Inicializa a curva de recebidos com todos os meses do ano
                let receivedCurve = monthsOfYear.map(month => ({
                    month,
                    value: 0
                }));

                // Soma valores pagos para cada mês
                monthlyFees.forEach(f => {
                    if (f.paid) {
                        const month = new Date(f.due_date).toISOString().slice(0, 7);
                        if (month.startsWith(`${receivablesCurveYear}-`)) {
                            const rc = receivedCurve.find(rc => rc.month === month);
                            if (rc) rc.value += Number(f.value);
                        }
                    }
                });

                // Ajusta o formato do mês para MM/YYYY
                receivedCurve = receivedCurve.map(item => {
                    const [year, month] = item.month.split("-");
                    return {
                        month: `${month}/${year}`,
                        value: item.value
                    };
                });

                reply.send({
                    activeStudents,
                    newRegistrations,
                    completedRegistrations,
                    avgClassOccupation,
                    classOccupation,
                    avgAttendance,
                    topAttendanceClasses,
                    bottomAttendanceClasses,
                    teacherWorkload,
                    classes: classStats,
                    lockedRegistrations,
                    classDays: classDaysList,
                    alertLowOccupation,
                    alertHighOccupation,
                    mrrDue,
                    mrrReceived,
                    mrrOpen,
                    aging,
                    dso,
                    defaultRate,
                    receivablesCurve,
                    receivedCurve,
                    earlyDiscount,
                    paymentMix: paymentMixArr,
                    avgTicket,
                    registrations: registrationsList,
                    lowAttendanceStudents,
                    classMeetings,
                    tasksByDiscipline,
                    pendingTasks,
                });
            }
        );
}