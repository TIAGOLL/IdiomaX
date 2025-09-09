import { PrismaClient } from "./generated/prisma"
import * as bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {

    await prisma.$transaction(async (prisma) => {

        console.log('Iniciando o seeding do banco de dados...')

        console.log('Criando senha padrão...')
        const hashedPassword = await bcrypt.hash("admin1", 10)

        console.log('Criando usuários OWNERS e companies...')
        await prisma.users.create({
            data: {
                name: 'João da Silva',
                email: 'joaodasilva@gmail.com',
                password: hashedPassword,
                cpf: '12345678901',
                phone: '11999990001',
                username: 'joaodasilva',
                gender: 'M',
                date_of_birth: new Date('1985-01-01'),
                address: 'Rua A, 123 - São Paulo',
                companies: {
                    create: {
                        id: "50429773-f9eb-4c8a-a086-8871c7bf1f44",
                        name: 'Tech Academy',
                        cnpj: '12345678000199',
                        address: 'Av. Paulista, 1000 - São Paulo',
                        phone: '1133334444',
                        email: 'contato@techacademy.com',
                        tax_regime: 'Simples Nacional',
                        state_registration: '123456789',
                        social_reason: 'Tech Academy Ltda',
                    }
                },
                member_on: {
                    create: {
                        role: 'ADMIN',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44",
                    }
                }
            }
        });


        console.log("Criando professores e alunos...")
        await prisma.users.create({
            data: {
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
                member_on: {
                    create: {
                        role: 'TEACHER',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
        })

        await prisma.users.create({
            data:
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
                member_on: {
                    create: {
                        role: 'STUDENT',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
        })

        await prisma.users.create({
            data: {
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
                member_on: {
                    create: {
                        role: 'TEACHER',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
        })
        await prisma.users.create({
            data: {
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
                member_on: {
                    create: {
                        role: 'STUDENT',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
        })

        await prisma.users.create({
            data: {
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
                member_on: {
                    create: {
                        role: 'TEACHER',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
        })

        await prisma.users.create({
            data: {
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
                member_on: {
                    create: {
                        role: 'STUDENT',
                        company_id: "50429773-f9eb-4c8a-a086-8871c7bf1f44"
                    }
                }
            },
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
