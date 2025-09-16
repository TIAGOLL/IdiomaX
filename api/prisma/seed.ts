import { PrismaClient, Role, WeekDays, type users } from "./generated/prisma"
import * as bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

// Função para garantir username único
function generateUniqueUsername(base: string, existingUsernames: Set<string>): string {
    let username = base;
    let counter = 1;
    while (existingUsernames.has(username)) {
        username = `${base}${counter}`;
        counter++;
    }
    existingUsernames.add(username);
    return username;
}

// Tipo customizado para usuários do seeder
type SeederUser = {
    id: string;
    name: string;
    email: string;
    password: string;
    cpf: string;
    phone: string;
    username: string;
    gender: string;
    date_of_birth: Date;
    address: string;
    active: boolean;
    avatar_url: string;
    created_at: Date;
    updated_at: Date;
    role: Role;
};

async function main() {
    await prisma.$transaction(async (prisma) => {
        console.log('Iniciando o seeding...')

        // 1. Crie o usuário owner primeiro
        const companyId = uuidv4()
        const hashedPassword = await bcrypt.hash("admin1", 10)
        const ownerUsername = 'tiago10'
        const ownerId = uuidv4()
        await prisma.users.create({
            data: {
                id: ownerId,
                name: "Tiago Emanuel",
                email: "tiagoepitanga10@gmail.com",
                password: hashedPassword,
                cpf: "11111111111",
                phone: "11999990000",
                avatar_url: "https://i.pravatar.cc/310",
                username: ownerUsername,
                gender: "M",
                date_of_birth: new Date("1980-01-01"),
                address: "Rua Admin, 1",
                active: true
            }
        })

        // 2. Crie a empresa usando o id do owner
        await prisma.companies.create({
            data: {
                id: companyId,
                name: 'IdiomaX',
                cnpj: '12345678000199',
                address: 'Av. Paulista, 1000 - São Paulo',
                phone: '1133334444',
                email: 'contato@idiomax.com',
                tax_regime: 'Simples Nacional',
                state_registration: '123456789',
                social_reason: 'IdiomaX Ltda',
                logo_16x16_url: "/images/logo.png",
                logo_512x512_url: "/images/logo.png",
                owner_id: ownerId // Relaciona owner à empresa
            }
        })

        // 3. Crie o relacionamento members entre owner e empresa
        await prisma.members.create({
            data: {
                user_id: ownerId,
                company_id: companyId,
                role: Role.ADMIN
            }
        })

        // USERS (19 students, 10 teachers)
        const users: SeederUser[] = [];
        const existingUsernames = new Set<string>();
        existingUsernames.add(ownerUsername);

        // Students
        for (let i = 1; i <= 19; i++) {
            const baseUsername = `aluno${i}`;
            const username = generateUniqueUsername(baseUsername, existingUsernames);
            users.push({
                id: uuidv4(),
                name: `Aluno ${i}`,
                email: `aluno${i}@idiomax.com`,
                password: hashedPassword,
                cpf: `${10000000000 + i}`,
                phone: `119999900${i.toString().padStart(2, "0")}`,
                avatar_url: `https://i.pravatar.cc/3${10 + i}`,
                username: username,
                gender: i % 2 === 0 ? "M" : "F",
                date_of_birth: randomDate(new Date("1990-01-01"), new Date("2005-12-31")),
                address: `Rua Estudante, ${i}`,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                role: Role.STUDENT
            });
        }

        // Teachers
        for (let i = 1; i <= 10; i++) {
            const baseUsername = `prof${i}`;
            const username = generateUniqueUsername(baseUsername, existingUsernames);
            users.push({
                id: uuidv4(),
                name: `Professor ${i}`,
                email: `prof${i}@idiomax.com`,
                password: hashedPassword,
                cpf: `${20000000000 + i}`,
                phone: `119888800${i.toString().padStart(2, "0")}`,
                avatar_url: `https://i.pravatar.cc/3${30 + i}`,
                username: username,
                gender: i % 2 === 0 ? "M" : "F",
                date_of_birth: randomDate(new Date("1970-01-01"), new Date("1995-12-31")),
                address: `Rua Professor, ${i}`,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                role: Role.TEACHER
            });
        }

        for (const user of users) {
            const { role, ...userData } = user;
            const createdUser = await prisma.users.create({
                data: {
                    ...userData
                }
            });
            await prisma.members.create({
                data: {
                    user_id: createdUser.id,
                    company_id: companyId,
                    role: role
                }
            });
        }

        // COURSES (3)
        const courses: string[] = []
        for (let i = 1; i <= 3; i++) {
            const id = uuidv4()
            courses.push(id)
            await prisma.courses.create({
                data: {
                    id,
                    name: `Curso ${i}`,
                    description: `Descrição do curso ${i}`,
                    registration_value: 500 + i * 50,
                    workload: 100 + i * 20,
                    monthly_fee_value: 300 + i * 25,
                    minimum_grade: 60,
                    maximum_grade: 100,
                    minimum_frequency: 75,
                    companies_id: companyId, // sempre a mesma empresa
                }
            })
        }

        // LEVELS (10)
        const levels: string[] = []
        for (let i = 1; i <= 10; i++) {
            const id = uuidv4()
            levels.push(id)
            await prisma.levels.create({
                data: {
                    id,
                    name: `Nível ${i}`,
                    level: i,
                    courses_id: randomFromArray(courses),
                }
            })
        }

        // DISCIPLINES (10)
        const disciplines: string[] = []
        for (let i = 1; i <= 10; i++) {
            const id = uuidv4()
            disciplines.push(id)
            await prisma.disciplines.create({
                data: {
                    id,
                    name: `Disciplina ${i}`,
                    levels_id: randomFromArray(levels),
                }
            })
        }

        // CLASSROOMS (5)
        const classrooms: string[] = []
        for (let i = 1; i <= 5; i++) {
            const id = uuidv4()
            classrooms.push(id)
            await prisma.classrooms.create({
                data: {
                    id,
                    number: 100 + i,
                    block: String.fromCharCode(65 + i),
                    companies_id: companyId,
                }
            })
        }

        // RENAMEDCLASS (10)
        const renamedClasses: string[] = []
        for (let i = 1; i <= 10; i++) {
            const id = uuidv4()
            renamedClasses.push(id)
            await prisma.renamedclass.create({
                data: {
                    id,
                    nome: `Turma ${i}`,
                    vacancies: 5 + i,
                    courses_id: randomFromArray(courses),
                }
            })
        }

        // CLASS_DAYS (dias da semana por turma)
        // Supondo que o campo correto na tabela seja 'weekday' (1=Dom, 2=Seg, ..., 7=Sab)
        const classDays: string[] = [];
        for (const classId of renamedClasses) {
            // Sorteia entre 2 e 4 dias da semana para cada turma
            const daysForClass = [...Object.values(WeekDays)].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
            for (const weekday of daysForClass) {
                const id = uuidv4();
                classDays.push(id);
                await prisma.class_days.create({
                    data: {
                        id,
                        week_date: weekday, // campo inteiro representando o dia da semana
                        class_id: classId,
                    }
                });
            }
        }

        // CLASSES (5)
        const classes: string[] = []
        for (let i = 1; i <= 5; i++) {
            const id = uuidv4()
            classes.push(id)
            // Gera um horário de início aleatório
            const startDate = randomDate(new Date("2025-09-01T19:00:00"), new Date("2025-12-01T21:00:00"));
            // Gera uma duração aleatória entre 1 e 2 horas
            const durationHours = Math.random() < 0.5 ? 1 : 2;
            const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
            await prisma.classes.create({
                data: {
                    id,
                    theme: `Tema da aula ${i}`,
                    start_date: startDate,
                    end_date: endDate,
                    class_id: randomFromArray(renamedClasses),
                }
            })
        }

        // USERS_IN_CLASS (aloca professores e alunos nas turmas)
        const teacherUsers = users.filter(u => u.role === Role.TEACHER);
        const studentUsers = users.filter(u => u.role === Role.STUDENT);

        // Alocar professores: cada professor em 1 a 5 turmas aleatórias
        for (const teacher of teacherUsers) {
            // Sorteia quantas turmas o professor terá (entre 1 e 5)
            const turmasCount = Math.floor(Math.random() * 5) + 1;
            // Sorteia turmas únicas para o professor
            const turmas = [...renamedClasses].sort(() => 0.5 - Math.random()).slice(0, turmasCount);
            for (const turmaId of turmas) {
                await prisma.users_in_class.create({
                    data: {
                        id: uuidv4(),
                        class_id: turmaId,
                        users_id: teacher.id,
                        teacher: true
                    }
                });
            }
        }

        // Alocar alunos: cada turma recebe 3 alunos aleatórios
        for (const classId of renamedClasses) {
            // Sorteia 3 alunos únicos para a turma
            const alunos = [...studentUsers].sort(() => 0.5 - Math.random()).slice(0, 3);
            for (const aluno of alunos) {
                await prisma.users_in_class.create({
                    data: {
                        id: uuidv4(),
                        class_id: classId,
                        users_id: aluno.id,
                        teacher: false
                    }
                });
            }
        }

        // REGISTRATIONS (10)
        const registrations: string[] = []
        for (let i = 1; i <= 10; i++) {
            const id = uuidv4()
            registrations.push(id)
            await prisma.registrations.create({
                data: {
                    id,
                    start_date: randomDate(new Date("2025-09-01"), new Date("2025-12-01")),
                    monthly_fee_amount: 350 + i * 10,
                    locked: i % 5 === 0,
                    completed: i % 4 === 0,
                    users_id: users[i + 1].id,
                    companies_id: companyId,
                }
            })
        }

        // MONTHLY_FEE (para cada registration, 6 mensalidades mensais)
        for (const regId of registrations) {
            // Busque a registration para pegar a data de início
            const registration = await prisma.registrations.findUnique({
                where: { id: regId },
                select: { start_date: true }
            });
            if (!registration) continue;
            const mensalidades = [];
            const now = new Date();

            // Faixas de aging para as 3 primeiras mensalidades vencidas
            const agingFaixas = [
                { dias: 15 },   // 0-30 dias vencida
                { dias: 45 },   // 31-60 dias vencida
                { dias: 75 },   // 61-90 dias vencida
                { dias: 120 },  // 90+ dias vencida
            ];

            // Gera 6 mensalidades por registration
            for (let i = 0; i < 6; i++) {
                let dueDate: Date;
                let paid: boolean;
                let discount_payment_before_due_date = 0;
                let date_of_payment = undefined;

                if (i < 4) {
                    // Mensalidades vencidas (1 em cada faixa)
                    dueDate = new Date(now);
                    dueDate.setDate(dueDate.getDate() - agingFaixas[i].dias);

                    // 50% pagas, 50% não pagas (alterna entre pagas e não pagas)
                    paid = i % 2 === 0;
                    if (paid) {
                        discount_payment_before_due_date = 10;
                        date_of_payment = new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000);
                    }
                } else {
                    // As duas últimas: uma paga e uma a vencer (futuro)
                    dueDate = new Date(now);
                    dueDate.setDate(dueDate.getDate() + (i - 3) * 15); // datas futuras
                    paid = i === 4; // a quinta é paga, a sexta não paga
                    if (paid) {
                        discount_payment_before_due_date = 10;
                        date_of_payment = new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000);
                    }
                }

                mensalidades.push({
                    id: uuidv4(),
                    due_date: dueDate,
                    value: 350,
                    paid,
                    discount_payment_before_due_date,
                    registrations_id: regId,
                    payment_method: randomFromArray(["PIX", "Cartão", "Boleto"]),
                    ...(paid ? { date_of_payment } : {})
                });
            }

            await prisma.monthly_fee.createMany({
                data: mensalidades
            });
        }

        // RECORDS_OF_STUDENTS (10)
        for (let i = 1; i <= 10; i++) {
            await prisma.records_of_students.create({
                data: {
                    id: uuidv4(),
                    registrations_id: registrations[i - 1], // Corrigido!
                    description: `Registro do aluno ${i}`,
                    title: `Registro ${i}`,
                    created_at: randomDate(new Date("2025-09-01"), new Date("2025-12-01")),
                }
            })
        }

        // PRESENCE_LIST (30)
        for (let i = 0; i < 30; i++) {
            await prisma.presence_list.create({
                data: {
                    id: uuidv4(),
                    is_present: Math.random() > 0.2,
                    users_id: randomFromArray(users).id,
                    classes_id: randomFromArray(classes),
                }
            })
        }

        // TASKS (50)
        const tasks: string[] = []
        for (let i = 1; i <= 50; i++) {
            const id = uuidv4()
            tasks.push(id)
            await prisma.tasks.create({
                data: {
                    id,
                    title: `Tarefa ${i}`,
                    description: `Descrição da tarefa ${i}`,
                    disciplines_id: randomFromArray(disciplines),
                    due_date: randomDate(new Date("2025-09-15"), new Date("2025-12-15")),
                }
            })
        }

        // TASKS_DELIVERY (30)
        for (let i = 0; i < 30; i++) {
            await prisma.tasks_delivery.create({
                data: {
                    id: uuidv4(),
                    tasks_id: randomFromArray(tasks),
                    registrations_id: randomFromArray(registrations),
                    date: randomDate(new Date("2025-09-14"), new Date("2025-12-14")),
                    link: `https://drive.google.com/tarefa-${i}`,
                }
            })
        }

        // MATERIAIS (1 por nível)
        for (const levelId of levels) {
            await prisma.materials.create({
                data: {
                    id: uuidv4(),
                    name: `Apostila ${levelId.slice(0, 6)}`,
                    file: Buffer.from("Conteúdo fictício da apostila"),
                    levels_id: levelId,
                }
            })
        }

        // CONFIGS
        await prisma.configs.create({
            data: {
                id: uuidv4(),
                registrations_time: 6,
                companies_id: companyId,
            }
        })
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding finalizado.')
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
