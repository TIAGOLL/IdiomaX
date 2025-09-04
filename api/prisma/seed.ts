import { PrismaClient } from "./generated/prisma"
import * as bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {

    await prisma.$transaction(async (prisma) => {

        console.log('Iniciando o seeding do banco de dados...')

        console.log('Criando senha padrão...')
        const hashedPassword = await bcrypt.hash("admin1", 10)

        console.log('Criando usuários OWNERS...')
        await prisma.users.createMany({
            data: [{
                id: '1fbf27f8-8306-480c-bfed-83d1a31f987a',
                name: 'João da Silva',
                email: 'joaodasilva@gmail.com',
                password: hashedPassword,
                cpf: '12345678901',
                phone: '11999990001',
                username: 'joaodasilva',
                gender: 'M',
                date_of_birth: new Date('1985-01-01'),
                address: 'Rua A, 123 - São Paulo',
            },
            {
                id: '2fbf27f8-8306-480c-bfed-83d1a31f987a',
                name: 'Maria da Silva',
                email: 'mariadasilva@gmail.com',
                password: hashedPassword,
                cpf: '12345678902',
                phone: '11999990002',
                username: 'mariadasilva',
                gender: 'F',
                date_of_birth: new Date('1985-01-01'),
                address: 'Rua A, 123 - São Paulo',
            }],
        })

        console.log("Criando os papéis...")
        await prisma.roles.createMany({
            data: [{
                id: 'a23171b0-7d77-48bc-b8bf-b5e0010d671d',
                name: 'ADMIN',
            },
            {
                id: 'b23171b0-7d77-48bc-b8bf-b5e0010d671d',
                name: 'TEACHER',
            },
            {
                id: 'c23171b0-7d77-48bc-b8bf-b5e0010d671d',
                name: 'STUDENT',
            },
            ],
        })

        console.log("Criando as escolas...")
        await prisma.companies.createMany({
            data: [
                {
                    id: '50429773-f9eb-4c8a-a086-8871c7bf1f44',
                    name: 'Tech Academy',
                    users_id: '1fbf27f8-8306-480c-bfed-83d1a31f987a',
                    address: 'Rua A, 123 - São Paulo',
                },
                {
                    id: '498e5243-ab1a-494f-b089-95cd8081447c',
                    name: 'Global Languages',
                    users_id: '2fbf27f8-8306-480c-bfed-83d1a31f987a',
                    address: 'Av. Central, 456 - Rio de Janeiro',
                },
            ],
        })

        console.log("Atribuindo papéis aos usuários...")
        await prisma.users_in_companies.createMany({
            data: [
                {
                    id: '1fbf27f8-8306-480c-bfed-83d1a31f987a',
                    users_id: '1fbf27f8-8306-480c-bfed-83d1a31f987a',
                    role_id: 'a23171b0-7d77-48bc-b8bf-b5e0010d671d',
                    companies_id: '50429773-f9eb-4c8a-a086-8871c7bf1f44',
                },
                {
                    id: '2fbf27f8-8306-480c-bfed-83d1a31f987a',
                    users_id: '2fbf27f8-8306-480c-bfed-83d1a31f987a',
                    role_id: 'a23171b0-7d77-48bc-b8bf-b5e0010d671d',
                    companies_id: '498e5243-ab1a-494f-b089-95cd8081447c',
                },
            ],
        })


        console.log("Criando professores e alunos...")
        await prisma.users.createMany({
            data: [
                {
                    id: "e1c1a7e2-8f7a-4c2a-9a1a-1a2b3c4d5e6f",
                    name: 'Ana Silva',
                    email: 'ana.silva@techacademy.com',
                    password: hashedPassword,
                    cpf: '12345678901',
                    phone: '11999990001',
                    username: 'ana.silva',
                    gender: 'F',
                    date_of_birth: new Date('1990-05-10'),
                    address: 'Rua A, 123 - São Paulo',
                },
                {
                    id: "f2d2b8e3-9a8b-4d3b-8b2a-2b3c4d5e6f7a",
                    name: 'Carlos Souza',
                    email: 'carlos.souza@techacademy.com',
                    password: hashedPassword,
                    cpf: '98765432100',
                    phone: '11999990002',
                    username: 'carlos.souza',
                    gender: 'M',
                    date_of_birth: new Date('1988-03-15'),
                    address: 'Rua B, 456 - São Paulo',
                },
                {
                    id: "a3e3c9f4-0b9c-5e4c-9c3b-3c4d5e6f7a8b",
                    name: 'Fernanda Lima',
                    email: 'fernanda.lima@globallanguages.com',
                    password: hashedPassword,
                    cpf: '11122233344',
                    phone: '21999990001',
                    username: 'fernanda.lima',
                    gender: 'F',
                    date_of_birth: new Date('1992-07-22'),
                    address: 'Av. Central, 456 - Rio de Janeiro',
                },
                {
                    id: "b4f4d0a5-1c0d-6f5d-0d4c-4d5e6f7a8b9c",
                    name: 'Rafael Alves',
                    email: 'rafael.alves@globallanguages.com',
                    password: hashedPassword,
                    cpf: '55566677788',
                    phone: '21999990002',
                    username: 'rafael.alves',
                    gender: 'M',
                    date_of_birth: new Date('1991-11-30'),
                    address: 'Rua das Palmeiras, 321 - Rio de Janeiro',
                },
                {
                    id: "c5a5e1b6-2d1e-7a6e-1e5d-5e6f7a8b9c0d",
                    name: 'Juliana Costa',
                    email: 'juliana.costa@nextlevel.com',
                    password: hashedPassword,
                    cpf: '99988877766',
                    phone: '31999990001',
                    username: 'juliana.costa',
                    gender: 'F',
                    date_of_birth: new Date('1993-01-05'),
                    address: 'Rua das Flores, 789 - Belo Horizonte',
                },
                {
                    id: "d6b6f2c7-3e2f-8b7f-2f6e-6f7a8b9c0d1e",
                    name: 'Marcos Pereira',
                    email: 'marcos.pereira@nextlevel.com',
                    password: hashedPassword,
                    cpf: '44455566677',
                    phone: '31999990002',
                    username: 'marcos.pereira',
                    gender: 'M',
                    date_of_birth: new Date('1989-09-17'),
                    address: 'Av. Brasil, 987 - Belo Horizonte',
                },
            ],
        })

        console.log("Atribuindo os papéis aos alunos e professores...")
        await prisma.users_in_companies.createMany({
            data: [
                {
                    // professor
                    id: uuidv4(),
                    users_id: "e1c1a7e2-8f7a-4c2a-9a1a-1a2b3c4d5e6f",
                    role_id: "b23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44",
                },
                {
                    // professor
                    id: uuidv4(),
                    users_id: "f2d2b8e3-9a8b-4d3b-8b2a-2b3c4d5e6f7a",
                    role_id: "b23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "498e5243-ab1a-494f-b089-95cd8081447c",
                },
                {
                    // aluno
                    id: uuidv4(),
                    users_id: "a3e3c9f4-0b9c-5e4c-9c3b-3c4d5e6f7a8b",
                    role_id: "c23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "498e5243-ab1a-494f-b089-95cd8081447c",
                },
                {
                    // aluno
                    id: uuidv4(),
                    users_id: "b4f4d0a5-1c0d-6f5d-0d4c-4d5e6f7a8b9c",
                    role_id: "c23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "498e5243-ab1a-494f-b089-95cd8081447c",
                },
                {
                    // aluno
                    id: uuidv4(),
                    users_id: "c5a5e1b6-2d1e-7a6e-1e5d-5e6f7a8b9c0d",
                    role_id: "c23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44",
                },
                {
                    // aluno
                    id: uuidv4(),
                    users_id: "d6b6f2c7-3e2f-8b7f-2f6e-6f7a8b9c0d1e",
                    role_id: "c23171b0-7d77-48bc-b8bf-b5e0010d671d",
                    companies_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44",
                },
            ],
        })
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seeding concluído.')
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
