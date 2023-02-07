import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function run(){
    /*Delete*/await Promise.all([
        prisma.cliente.deleteMany(),
        prisma.endereco.deleteMany()
    ])
    /*Create cliente*/ await Promise.all([
        prisma.cliente.create({
            data:{
                id: 1,
                nomeRazaoSocial: 'Higor',
                cpfCnpj: '111111111-11',
                telefone: '(11)91111-1111',
                email: 'higor@gmail.com',
                inscricaoEstadual: 'SP',
                Endereco:{
                    create: {
                        id: 1,
                        cep: '11111-111',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        logradouro: 'Rua 1',
                        numero: 1001,
                        complemento: 'esquina'   
                    }
                }
            }
        }),
        prisma.cliente.create({
            data:{
                id: 2,
                nomeRazaoSocial: 'Gabriel',
                cpfCnpj: '222222222-22',
                telefone: '(22)92222-2222',
                email: 'gabriel@gmail.com',
                inscricaoEstadual: 'RJ',
                Endereco:{
                    create:{
                        id: 2,
                        cep: '22222-222',
                        cidade: 'Rio de Janeiro',
                        estado: 'RJ',
                        logradouro: 'Rua 2',
                        numero: 1002,
                        complemento: 'esquina'
                    }
                }
            }
        }),
        prisma.cliente.create({
            data:{
                id: 3,
                nomeRazaoSocial: 'Breno',
                cpfCnpj: '333333333-33',
                telefone: '(33)93333-3333',
                email: 'breno@gmail.com',
                inscricaoEstadual: 'MG',
                Endereco:{
                    create:{
                        id: 3,
                        cep: '33333-333',
                        cidade: 'Belo Horizonte',
                        estado: 'MG',
                        logradouro: 'Rua 3',
                        numero: 1003,
                        complemento: 'esquina'
                    }
                }
            }
        }),
    ])
}

run().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})
