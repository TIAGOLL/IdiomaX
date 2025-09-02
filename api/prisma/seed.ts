import { PrismaClient } from "./generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    console.log('Iniciando o seeding do banco de dados...')

    console.log('Criando senha padrão')
    const hashedPassword = await bcrypt.hash("123456", 10)

    console.log('Criando usuários OWNERS')
    const ownerUser = await prisma.users.createMany({
        data: {
            id: '1fbf27f8-8306-480c-bfed-83d1a31f987a',
            name: 'João da Silva',
            email: 'joaodasilva@gmail.com',
            password: hashedPassword,
            cpf: '12345678901',
            phone: '11999990001',
            username: 'joaodasilva',
            gender: 'M',
            date_of_birth: new Date('1985-01-01'),
            companies_id: 'company-1',
            address: 'Rua A, 123 - São Paulo',
        },
        
    })

    const ownerRole = await prisma.roles.upsert({
        where: { id: 'OWNER' },
        update: {},
        create: {
            id: 'a23171b0-7d77-48bc-b8bf-b5e0010d671d',
            name: 'OWNER',
        },
    })
    console.log('Role OWNER criada:')

    const companies = await prisma.companies.createMany({
        data: [
            {
                id: 'company-1',
                name: 'Tech Academy',
                users_id: 'admin-1',
                address: 'Rua A, 123 - São Paulo',
            },
            {
                id: 'company-2',
                name: 'Global Languages',
                users_id: 'admin-2',
                address: 'Av. Central, 456 - Rio de Janeiro',
            },
            {
                id: 'company-3',
                name: 'Next Level Education',
                users_id: 'admin-3',
                address: 'Rua das Flores, 789 - Belo Horizonte',
            },
        ],
    })

    console.log('Companies criadas:', companies)

    await prisma.users.createMany({
        data: [
            {
                id: 'user-1',
                name: 'Ana Silva',
                email: 'ana.silva@techacademy.com',
                password: '123456',
                cpf: '12345678901',
                phone: '11999990001',
                username: 'ana.silva',
                gender: 'Feminino',
                date_of_birth: new Date('1990-05-10'),
                companies_id: 'company-1',
                address: 'Rua A, 123 - São Paulo',
            },
            {
                id: 'user-2',
                name: 'Carlos Souza',
                email: 'carlos.souza@techacademy.com',
                password: '123456',
                cpf: '98765432100',
                phone: '11999990002',
                username: 'carlos.souza',
                gender: 'Masculino',
                date_of_birth: new Date('1988-03-15'),
                companies_id: 'company-1',
                address: 'Rua B, 456 - São Paulo',
            },
            {
                id: 'user-3',
                name: 'Fernanda Lima',
                email: 'fernanda.lima@globallanguages.com',
                password: '123456',
                cpf: '11122233344',
                phone: '21999990001',
                username: 'fernanda.lima',
                gender: 'Feminino',
                date_of_birth: new Date('1992-07-22'),
                companies_id: 'company-2',
                address: 'Av. Central, 456 - Rio de Janeiro',
            },
            {
                id: 'user-4',
                name: 'Rafael Alves',
                email: 'rafael.alves@globallanguages.com',
                password: '123456',
                cpf: '55566677788',
                phone: '21999990002',
                username: 'rafael.alves',
                gender: 'Masculino',
                date_of_birth: new Date('1991-11-30'),
                companies_id: 'company-2',
                address: 'Rua das Palmeiras, 321 - Rio de Janeiro',
            },
            {
                id: 'user-5',
                name: 'Juliana Costa',
                email: 'juliana.costa@nextlevel.com',
                password: '123456',
                cpf: '99988877766',
                phone: '31999990001',
                username: 'juliana.costa',
                gender: 'Feminino',
                date_of_birth: new Date('1993-01-05'),
                companies_id: 'company-3',
                address: 'Rua das Flores, 789 - Belo Horizonte',
            },
            {
                id: 'user-6',
                name: 'Marcos Pereira',
                email: 'marcos.pereira@nextlevel.com',
                password: '123456',
                cpf: '44455566677',
                phone: '31999990002',
                username: 'marcos.pereira',
                gender: 'Masculino',
                date_of_birth: new Date('1989-09-17'),
                companies_id: 'company-3',
                address: 'Av. Brasil, 987 - Belo Horizonte',
            },
        ],
    })

    console.log('Usuários criados!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
