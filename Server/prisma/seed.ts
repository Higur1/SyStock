import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  async function resetId(tabela: string) {
    await prisma.$queryRaw`
            UPDATE 'sqlite_sequence'
            SET 'seq' = 0
            WHERE name = ${tabela}
        `;
  }
  /*Deletes*/ await Promise.all([
    prisma.company_Address.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.batch.deleteMany(),
    prisma.company.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.user_Types.deleteMany(),
  ]);
  /* Create generic company */ await Promise.all([
    prisma.company.create({
      data: {
        id: 1,
        name: "DEFAULT",
        cnpj: "DEFAULT",
        email: "DEFAULT",
        state_registration: "DEFAULT",
      },
    }),
  ]);
  /* Create address for generic company*/ await Promise.all([
    prisma.company_Address.create({
      data: {
        cep: "DEFAULT",
        city: "DEFAULT",
        company_id: 1,
        complement: "",
        number: 0,
        state: "X",
        street: "DEFAULT",
      },
    }),
  ]);
  /* Create generic supplier*/ await Promise.all([
    prisma.supplier.create({
      data: {
        id: 1,
        name: "DEFAULT",
        email: "DEFAULT",
        company_id: 1,
      },
    }),
  ]);
  /* Create generic batch*/ await Promise.all([
    prisma.batch.create({
      data: {
        id: 1,
        date: "1970-01-01T00:00:00.000Z",
        number: "DEFAULT",
        supplier_id: 1,
      },
    }),
  ]);
  /*Create category*/ await Promise.all([
    resetId("categories"),
    prisma.category.create({
      data: {
        id: 1,
        name: "Alimentar",
      },
    }),
    prisma.category.create({
      data: {
        id: 2,
        name: "Eletronico",
      },
    }),
    prisma.category.create({
      data: {
        id: 3,
        name: "Serviço",
      },
    }),
    prisma.category.create({
      data: {
        id: 4,
        name: "Eletrodoméstico",
      },
    }),
    prisma.category.create({
      data: {
        id: 5,
        name: "Cama/Mesa/Banho",
      },
    }),
    prisma.category.create({
      data: {
        id: 6,
        name: "Padaria",
      },
    }),
    prisma.category.create({
      data: {
        id: 7,
        name: "Açougue",
      },
    }),
    prisma.category.create({
      data: {
        id: 8,
        name: "Brinquedos",
      },
    }),
    prisma.category.create({
      data: {
        id: 9,
        name: "Elétrica",
      },
    }),
    prisma.category.create({
      data: {
        id: 10,
        name: "Automotiva",
      },
    }),
  ]);
  /*Create product*/ await Promise.all([
    resetId("products"),
    prisma.product.create({
      data: {
        description: "Frango assado com batatas e farofa",
        ncmSh: "110",
        price: 45.0,
        category_id: 1,
      },
    }),
    prisma.product.create({
      data: {
        description: "Cachorro-Quente completo prensado",
        ncmSh: "111",
        price: 15.0,
        category_id: 1,
      },
    }),
    prisma.product.create({
      data: {
        description:
          'Smart TV LED 42" Full HD Philco PTV42G52RCF com WiFi, HDMI, USB e Processador Quad-core',
        ncmSh: "112",
        price: 1482.0,
        category_id: 2,
      },
    }),
    prisma.product.create({
      data: {
        description: "Computador Completo Intel Core i3 6GB HD 500GB",
        ncmSh: "113",
        price: 1146.0,
        category_id: 2,
      },
    }),
    prisma.product.create({
      data: {
        description: "Pintura de predios 40m²",
        ncmSh: "114",
        price: 1200.0,
        category_id: 3,
      },
    }),
    prisma.product.create({
      data: {
        description: "Lavagem de carros e motos",
        ncmSh: "115",
        price: 50.0,
        category_id: 3,
      },
    }),
    prisma.product.create({
      data: {
        description:
          "Forno de Micro-ondas Midea MRAS2 com Função Eco 20L – Branco",
        ncmSh: "116",
        price: 499.0,
        category_id: 4,
      },
    }),
    prisma.product.create({
      data: {
        description: "Fogão 5 Bocas Atlas Mônaco Top Glass",
        ncmSh: "117",
        price: 1099.0,
        category_id: 4,
      },
    }),
    prisma.product.create({
      data: {
        description: "Cama Box Emma",
        ncmSh: "118",
        price: 699.0,
        category_id: 5,
      },
    }),
    prisma.product.create({
      data: {
        description: "Kit Toalhas de Banho/Rosto 200 Fios Super Premium",
        ncmSh: "119",
        price: 33.0,
        category_id: 5,
      },
    }),
    prisma.product.create({
      data: {
        description: "Pão Francês",
        ncmSh: "120",
        price: 1.0,
        category_id: 6,
      },
    }),
    prisma.product.create({
      data: {
        description: "Sonho de creme",
        ncmSh: "121",
        price: 4.0,
        category_id: 6,
      },
    }),
    prisma.product.create({
      data: {
        description: "Picanha 1k600g",
        ncmSh: "122",
        price: 103.0,
        category_id: 7,
      },
    }),
    prisma.product.create({
      data: {
        description: "Lombo 1k100g",
        ncmSh: "123",
        price: 29.0,
        category_id: 7,
      },
    }),
    prisma.product.create({
      data: {
        description: "Brinquedo lego star-wars",
        ncmSh: "124",
        price: 219.0,
        category_id: 8,
      },
    }),
    prisma.product.create({
      data: {
        description: "Quebra-Cabeça 1000 peças do Harry Poter",
        ncmSh: "125",
        price: 153.0,
        category_id: 8,
      },
    }),
    prisma.product.create({
      data: {
        description: "Cabo Flexível 2,5mm 100m Preto 750V SIL",
        ncmSh: "126",
        price: 169.0,
        category_id: 9,
      },
    }),
    prisma.product.create({
      data: {
        description:
          "Fita Isolante 3M Scotch 33+ Uso Profissional Classe A Preta 19mm x 10m x 0,19mm unidade",
        ncmSh: "127",
        price: 16.0,
        category_id: 9,
      },
    }),
    prisma.product.create({
      data: {
        description: "Volkswagen Polo",
        ncmSh: "128",
        price: 103990.0,
        category_id: 10,
      },
    }),
    prisma.product.create({
      data: {
        description: "Yamaha Fazer 150cc",
        ncmSh: "129",
        price: 12500.0,
        category_id: 10,
      },
    }),
  ]);
  /*Create user_type*/ await Promise.all([
    prisma.user_Types.create({
      data: {
        name: "Administrador",
      },
    }),
    prisma.user_Types.create({
      data: {
        name: "Gerente",
      },
    }),
  ]);
  /*Create users*/ await Promise.all([
    prisma.user.create({
      data: {
        name: "Higor",
        email: "Higor@gmail.com",
        user_login: "Higu",
        user_password: "Higu",
        user_type_id: 2,
      },
    }),
    prisma.user.create({
      data: {
        name: "Breno",
        email: "Breno@gmail.com",
        user_login: "Bre",
        user_password: "Bre",
        user_type_id: 2,
      },
    }),
    prisma.user.create({
      data: {
        name: "Gabriel",
        email: "Gabriel@gmail.com",
        user_login: "Gabriel",
        user_password: "Gabriel",
        user_type_id: 1,
      },
    }),
  ]);
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
