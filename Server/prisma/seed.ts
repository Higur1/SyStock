import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function run() {
    /*Delete*/await Promise.all([
    prisma.endereco.deleteMany(),
    prisma.cliente.deleteMany(),
    prisma.endereco_Fornecedor.deleteMany(),
    prisma.fornecedor.deleteMany(),
    prisma.produto.deleteMany(),
    prisma.categoria.deleteMany
]);
    /*Create cliente*/ await Promise.all([
    prisma.cliente.create({
        data: {
            id: 1,
            nomeRazaoSocial: 'Higor',
            cpfCnpj: '111111111-11',
            telefone: '(11)91111-1111',
            email: 'higor@gmail.com',
            inscricaoEstadual: 'SP',
            Endereco: {
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
        data: {
            id: 2,
            nomeRazaoSocial: 'Gabriel',
            cpfCnpj: '222222222-22',
            telefone: '(22)92222-2222',
            email: 'gabriel@gmail.com',
            inscricaoEstadual: 'RJ',
            Endereco: {
                create: {
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
        data: {
            id: 3,
            nomeRazaoSocial: 'Breno',
            cpfCnpj: '333333333-33',
            telefone: '(33)93333-3333',
            email: 'breno@gmail.com',
            inscricaoEstadual: 'MG',
            Endereco: {
                create: {
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
]);
    /*Create fornecedor */ await Promise.all([
    prisma.fornecedor.create({
        data: {
            id: 1,
            razaoSocial: 'HigorEmpresa',
            cnpj: '111111111-11',
            telefone: '(11)91111-1111',
            email: 'higor@gmail.com',
            inscricaoEstadual: 'SP',
            Endereco_Fornecedor: {
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
    prisma.fornecedor.create({
        data: {
            id: 2,
            razaoSocial: 'GabrielEmpresa',
            cnpj: '222222222-22',
            telefone: '(22)92222-2222',
            email: 'gabriel@gmail.com',
            inscricaoEstadual: 'RJ',
            Endereco_Fornecedor: {
                create: {
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
    prisma.fornecedor.create({
        data: {
            id: 3,
            razaoSocial: 'BrenoEmpresa',
            cnpj: '333333333-33',
            telefone: '(33)93333-3333',
            email: 'breno@gmail.com',
            inscricaoEstadual: 'MG',
            Endereco_Fornecedor: {
                create: {
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
]);
    /*Create categoria*/ await Promise.all([
    prisma.categoria.create({
        data: {
            id: 1,
            nome: 'Alimentar'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 2,
            nome: 'Eletronico'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 3,
            nome: 'Serviço'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 4,
            nome: 'Eletrodoméstico'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 5,
            nome: 'Cama/Mesa/Banho'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 6,
            nome: 'Padaria'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 7,
            nome: 'Açougue'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 8,
            nome: 'Brinquedos'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 9,
            nome: 'Elétrica'
        }
    }),
    prisma.categoria.create({
        data: {
            id: 10,
            nome: 'Automotiva'
        }
    })
]);
    /*Create produto*/ await Promise.all([
    prisma.produto.create({
        data: {
            nome: 'Frango Assado',
            descricao: 'Frango assado com batatas e farofa',
            ncmSh: '111',
            preco: 45.0,
            id_categoria: 1,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Cachorro-Quente',
            descricao: 'Cachorro-Quente completo prensado',
            ncmSh: '111',
            preco: 15.0,
            id_categoria: 1,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Televisão',
            descricao: 'Smart TV LED 42" Full HD Philco PTV42G52RCF com WiFi, HDMI, USB e Processador Quad-core',
            ncmSh: '111',
            preco: 1482.0,
            id_categoria: 2,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Computador',
            descricao: 'Computador Completo Intel Core i3 6GB HD 500GB',
            ncmSh: '111',
            preco: 1146.65,
            id_categoria: 2,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Pintura',
            descricao: 'Pintura de predios 40m²',
            ncmSh: '111',
            preco: 1200.00,
            id_categoria: 3,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Lava-Rápido',
            descricao: 'Lavagem de carros e motos',
            ncmSh: '111',
            preco: 50.00,
            id_categoria: 3,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Micro-ondas',
            descricao: 'Forno de Micro-ondas Midea MRAS2 com Função Eco 20L – Branco',
            ncmSh: '111',
            preco: 499.99,
            id_categoria: 4,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Fogão',
            descricao: 'Fogão 5 Bocas Atlas Mônaco Top Glass',
            ncmSh: '111',
            preco: 1099.68,
            id_categoria: 4,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Cama',
            descricao: 'Cama Box Emma',
            ncmSh: '111',
            preco: 699.00,
            id_categoria: 5,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Toalha',
            descricao: 'Kit Toalhas de Banho/Rosto 200 Fios Super Premium',
            ncmSh: '111',
            preco: 33.00,
            id_categoria: 5,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Pão',
            descricao: 'Pão Francês',
            ncmSh: '111',
            preco: 0.25,
            id_categoria: 6,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Sonho',
            descricao: 'Sonho de creme',
            ncmSh: '111',
            preco: 4.0,
            id_categoria: 6,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Carne',
            descricao: 'Picanha 1k600g',
            ncmSh: '111',
            preco: 103.57,
            id_categoria: 7,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Carne de porco',
            descricao: 'Lombo 1k100g',
            ncmSh: '111',
            preco: 29.99,
            id_categoria: 7,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Lego',
            descricao: 'Brinquedo lego star-wars',
            ncmSh: '111',
            preco: 219.99,
            id_categoria: 8,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Quebra-Cabeça',
            descricao: 'Quebra-Cabeça 1000 peças do Harry Poter',
            ncmSh: '111',
            preco: 153.99,
            id_categoria: 8,
            id_fornecedor: 2
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Fio Preto',
            descricao: 'Cabo Flexível 2,5mm 100m Preto 750V SIL',
            ncmSh: '111',
            preco: 169.99,
            id_categoria: 9,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Fita Isolante',
            descricao: 'Fita Isolante 3M Scotch 33+ Uso Profissional Classe A Preta 19mm x 10m x 0,19mm unidade',
            ncmSh: '111',
            preco: 16.29,
            id_categoria: 9,
            id_fornecedor: 3
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Carro',
            descricao: 'Volkswagen Polo',
            ncmSh: '111',
            preco: 103990.00,
            id_categoria: 10,
            id_fornecedor: 1
        }
    }),
    prisma.produto.create({
        data: {
            nome: 'Moto',
            descricao: 'Yamaha Fazer 150cc',
            ncmSh: '111',
            preco: 12500.00,
            id_categoria: 10,
            id_fornecedor: 1
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
