import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function run() {
    async function resetId(tabela: string){
        await prisma.$queryRaw`
            UPDATE 'sqlite_sequence'
            SET 'seq' = 0
            WHERE name = ${tabela}
        `
    }
    /*Deletes*/ await Promise.all([
        prisma.product.deleteMany(),
        prisma.category.deleteMany(),
        prisma.supplier_Address.deleteMany(),
        prisma.supplier.deleteMany(),
        prisma.user.deleteMany(),
        prisma.user_Types.deleteMany(),
        //prisma.$queryRaw`DELETE FROM customer_address`,
        //prisma.$queryRaw`DELETE FROM customers`
    ]);
    /*Create supplier*/ await Promise.all([
        resetId('suppliers'),
        prisma.supplier.create({
            data: {
                company_name: 'HigorEmpresa',
                email: 'higor@gmail.com',
                cnpj: '111111111-11',
                state_registration: 'SP',
                phone: '(11)91111-1111',
                Supplier_Address:{
                    create:{
                        cep: '11111-111',
                        city: 'São Paulo',
                        state: 'SP',
                        street:'Rua 1',
                        number: 1001,
                        complement: 'esquina'
                    }
                }
            }
        }),
        prisma.supplier.create({
            data: {
                company_name: 'GabrielEmpresa',
                email: 'gabriel@gmail.com',
                cnpj: '222222222-22',
                state_registration: 'RJ',
                phone: '(22)92222-2222',
                Supplier_Address:{
                    create:{
                        cep: '22222-222',
                        city: 'Rio de Janeiro',
                        state: 'RJ',
                        street:'Rua 2',
                        number: 1002,
                        complement: 'esquina'
                    }
                }
            }
        }),
        prisma.supplier.create({
            data: {
                company_name: 'BrenoEmpresa',
                email: 'breno@gmail.com',
                cnpj: '333333333-33',
                state_registration: 'MG',
                phone: '(33)93333-3333',
                Supplier_Address:{
                    create:{
                        cep: '33333-333',
                        city: 'Belo Horizonte',
                        state: 'MG',
                        street:'Rua 3',
                        number: 1003,
                        complement: 'esquina'
                    }
                }
            }
        }),

    ]);
    /*Create category*/ await Promise.all([
        resetId('categories'),
        prisma.category.create({
            data: {
                id: 1,
                name: 'Alimentar'
            }
        }),
        prisma.category.create({
            data: {
                id: 2,
                name: 'Eletronico'
            }
        }),
        prisma.category.create({
            data: {
                id: 3,
                name: 'Serviço'
            }
        }),
        prisma.category.create({
            data: {
                id: 4,
                name: 'Eletrodoméstico'
            }
        }),
        prisma.category.create({
            data: {
                id: 5,
                name: 'Cama/Mesa/Banho'
            }
        }),
        prisma.category.create({
            data: {
                id: 6,
                name: 'Padaria'
            }
        }),
        prisma.category.create({
            data: {
                id: 7,
                name: 'Açougue'
            }
        }),
        prisma.category.create({
            data: {
                id: 8,
                name: 'Brinquedos'
            }
        }),
        prisma.category.create({
            data: {
                id: 9,
                name: 'Elétrica'
            }
        }),
        prisma.category.create({
            data: {
                id: 10,
                name: 'Automotiva'
            }
        })
    ]);
    /*Create product*/ await Promise.all([
        resetId('products'),
        prisma.product.create({
            data: {
                name: 'Frango Assado',
                description: 'Frango assado com batatas e farofa',
                ncmSh: '110',
                price: 45.0,
                category_id: 1,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Cachorro-Quente',
                description: 'Cachorro-Quente completo prensado',
                ncmSh: '111',
                price: 15.0,
                category_id: 1,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Televisão',
                description: 'Smart TV LED 42" Full HD Philco PTV42G52RCF com WiFi, HDMI, USB e Processador Quad-core',
                ncmSh: '112',
                price: 1482.0,
                category_id: 2,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Computador',
                description: 'Computador Completo Intel Core i3 6GB HD 500GB',
                ncmSh: '113',
                price: 1146.0,
                category_id: 2,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Pintura',
                description: 'Pintura de predios 40m²',
                ncmSh: '114',
                price: 1200.0,
                category_id: 3,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Lava-Rápido',
                description: 'Lavagem de carros e motos',
                ncmSh: '115',
                price: 50.0,
                category_id: 3,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Micro-ondas',
                description: 'Forno de Micro-ondas Midea MRAS2 com Função Eco 20L – Branco',
                ncmSh: '116',
                price: 499.0,
                category_id: 4,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Fogão',
                description: 'Fogão 5 Bocas Atlas Mônaco Top Glass',
                ncmSh: '117',
                price: 1099.0,
                category_id: 4,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Cama',
                description: 'Cama Box Emma',
                ncmSh: '118',
                price: 699.00,
                category_id: 5,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Toalha',
                description: 'Kit Toalhas de Banho/Rosto 200 Fios Super Premium',
                ncmSh: '119',
                price: 33.00,
                category_id: 5,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Pão',
                description: 'Pão Francês',
                ncmSh: '120',
                price: 1.0,
                category_id: 6,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Sonho',
                description: 'Sonho de creme',
                ncmSh: '121',
                price: 4.0,
                category_id: 6,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Carne',
                description: 'Picanha 1k600g',
                ncmSh: '122',
                price: 103.00,
                category_id: 7,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Carne de porco',
                description: 'Lombo 1k100g',
                ncmSh: '123',
                price: 29.00,
                category_id: 7,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Lego',
                description: 'Brinquedo lego star-wars',
                ncmSh: '124',
                price: 219.00,
                category_id: 8,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Quebra-Cabeça',
                description: 'Quebra-Cabeça 1000 peças do Harry Poter',
                ncmSh: '125',
                price: 153.00,
                category_id: 8,
                supplier_id: 2
            }
        }),
        prisma.product.create({
            data: {
                name: 'Fio Preto',
                description: 'Cabo Flexível 2,5mm 100m Preto 750V SIL',
                ncmSh: '126',
                price: 169.00,
                category_id: 9,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Fita Isolante',
                description: 'Fita Isolante 3M Scotch 33+ Uso Profissional Classe A Preta 19mm x 10m x 0,19mm unidade',
                ncmSh: '127',
                price: 16.00,
                category_id: 9,
                supplier_id: 3
            }
        }),
        prisma.product.create({
            data: {
                name: 'Carro',
                description: 'Volkswagen Polo',
                ncmSh: '128',
                price: 103990.00,
                category_id: 10,
                supplier_id: 1
            }
        }),
        prisma.product.create({
            data: {
                name: 'Moto',
                description: 'Yamaha Fazer 150cc',
                ncmSh: '129',
                price: 12500.00,
                category_id: 10,
                supplier_id: 1
            }
        }),
    ]);
    /*Create user_type*/await Promise.all([
        prisma.user_Types.create({
            data:{
                name: "Administrador"
            }
        }),
        prisma.user_Types.create({
            data:{
                name: "Gerente"
            }
        })
    ]);
    /*Create users*/ await Promise.all([
        prisma.user.create({
            data:{
                name: "Higor",
                email: "Higor@gmail.com",
                user_login: "Higu",
                user_password: "Higu",
                user_type_id: 2
            }
        }),
        prisma.user.create({
            data:{
                name: "Breno",
                email: "Breno@gmail.com",
                user_login: "Bre",
                user_password: "Bre",
                user_type_id: 2
            }
        }),
        prisma.user.create({
            data:{
                name: "Gabriel",
                email: "Gabriel@gmail.com",
                user_login: "Gabriel",
                user_password: "Gabriel",
                user_type_id: 1
            }
        }),
    ]);
}
    /*Create cliente await Promise.all([
        resetId('clientes'),
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
    ]);*/
    
run().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
