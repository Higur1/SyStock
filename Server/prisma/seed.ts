import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { dateBase } from "../src/functions/baseFunctions";
const prisma = new PrismaClient();

const salt = bcrypt.genSaltSync(10);

async function resetId() {
  await prisma.$queryRaw`
          UPDATE 'sqlite_sequence'
          SET 'seq' = 0
      `;
}
async function updateQuantityProduct(product_id, quantity) {
  await prisma.product.update({
    where: {
      id: product_id
    },
    data: {
      totalQuantityInStock: {
        increment: quantity
      }
    }
  })
}

resetId();
try {
  /*Delete */ await prisma.$transaction([
  prisma.token_Recovery.deleteMany(),
  prisma.user.deleteMany(),
  prisma.batch.deleteMany(),
  prisma.product.deleteMany(),
  prisma.category.deleteMany(),
  prisma.supplier.deleteMany(),
  prisma.eValitadionStatus.deleteMany(),
  prisma.eTypeAction.deleteMany(),
  prisma.eTypeUser.deleteMany(),
]);

  await Promise.all([
    /*Create type of users */
    await prisma.eTypeUser.createMany({
      data: [
        { id: 1, type: "Admin" },
        { id: 2, type: "Funcionario" },
      ],
    }),

    /*Create users */
    await prisma.user.create({
      data: {
        id: 1,
        user_type: 1,
        login: "Admin HGB",
        email: "hgbsystemstock@gmail.com",
        name: "Admin HGB",
        password: bcrypt.hashSync("Admin HGB", salt),
        excludedStatus: false,
      },
    }),

    await prisma.eValitadionStatus.createMany({
      data: [
        { id: 1, type: "dataValidadeAtingida" },
        { id: 2, type: "dataValidadeProximaASerAtingida" },
        { id: 3, type: "dentroDaValidade" },
        { id: 4, type: "não possui validade" },
      ],
    }),
    await prisma.eTypeAction.createMany({
      data: [
        { id: 1, type: "Incluido no sistema" },
        { id: 2, type: "Removido por venda" },
        { id: 3, type: "Removido por usuário"},
      ],
    }),

    /*Create categories*/
    await prisma.category.createMany({
      data: [
        { id: 1, name: "GenericCategory",},
        { id: 2, name: "Argamassa",},
        { id: 3, name: "Caixas d'água",},
        { id: 4, name: "Cimento",},
        { id: 5, name: "Rejuntes",},
        { id: 6, name: "Telha",},
		{ id: 7, name: "Estruturas metálicas" },
		{ id: 8, name: "Coberturas e telhados" },
		{ id: 9, name: "Ferragens" },
		{ id: 10, name: "Madeiras" },
		{ id: 11, name: "Tintas" },
		{ id: 12, name: "Tubulações" },
		{ id: 13, name: "Ferramentas" },
    { id: 14, name: "Pregos e Parafusos" },
    { id: 15, name: "Conexões para tubos pvc" }
      ],
    }),
    await prisma.product.createMany({
      data: [
        { id: 1, name: "Argamassa ACIII Interno e Externo Cinza 20kg Votoran", category_id: 2, price: 39.0, costPrice: 23.55, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false},
        { id: 2, name: "Argamassa Porcelanato Interno e Externo Cinza 20kg Axton", category_id: 2, price: 27.5, costPrice: 16.53, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 3, name: "Caixa d'água Polietileno 1.000L Azul Fortlev", category_id: 3, price: 349.9, costPrice: 209.94, minimunQuantity: 2, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 4, name: "Caixa d'água Polietileno 500L Azul Fortlev", category_id: 3, price: 209.9, costPrice: 125.94, minimunQuantity: 2, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 5, name: "Tanque + Green 500L Acqualimp", category_id: 3, price: 379.9, costPrice: 265.93, minimunQuantity: 1, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 6, name: "Cimento CP II F 32 Todas as Obras 50kg Votoran", category_id: 4, price: 31.9, costPrice: 23.92, minimunQuantity: 6, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 7, name: "Rejunte Cimentício Aditivado Cinza Platina 1 Kg Axton", category_id: 5, price: 16.0, costPrice: 8.41, minimunQuantity: 8, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 8, name: "Rejunte Acrílico Rejunte Base Plástica Branco 1kg Axton", category_id: 5, price: 28.0, costPrice: 18.27, minimunQuantity: 6, observation: "", totalQuantityInStock: 0, excludedStatus: false},
        { id: 9, name: "Telha de Polipropileno Ondulada 50x153cm 1,1mm Translúcida Atco", category_id: 6, price: 36.0, costPrice: 18.03, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false, },
        { id: 10, name: "Telha Cerâmica Vermelha", category_id: 6, price: 20.0, costPrice: 16.0, minimunQuantity: 5, observation: "Telha resistente.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 11, name: "Telha Galvanizada", category_id: 6, price: 50.0, costPrice: 40.0, minimunQuantity: 10, observation: "Industrial.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 12, name: "Cimento CP II 50kg", category_id: 4, price: 35.0, costPrice: 28.0, minimunQuantity: 15, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 13, name: "Cimento Branco", category_id: 4, price: 45.0, costPrice: 37.0, minimunQuantity: 8, observation: "", totalQuantityInStock: 0, excludedStatus: true },
        { id: 14, name: "Prego 18x27mm", category_id: 14, price: 15.0, costPrice: 10.0, minimunQuantity: 20, observation: "Uso geral.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 15, name: "Arame Recozido 1kg", category_id: 9, price: 25.0, costPrice: 18.0, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 16, name: "Tábua de Pinus", category_id: 10, price: 12.0, costPrice: 9.0, minimunQuantity: 10, observation: "Para estruturas leves.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 17, name: "Caibro de Eucalipto", category_id: 10, price: 30.0, costPrice: 22.0, minimunQuantity: 15, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 18, name: "Tinta Látex Branca", category_id: 11, price: 50.0, costPrice: 35.0, minimunQuantity: 10, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 19, name: "Tinta Óleo Vermelha", category_id: 11, price: 70.0, costPrice: 50.0, minimunQuantity: 8, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 20, name: "Canos PVC 100mm", category_id: 12, price: 25.0, costPrice: 18.0, minimunQuantity: 10, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 21, name: "Conexão em T PVC", category_id: 15, price: 8.0, costPrice: 6.0, minimunQuantity: 25, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 22, name: "Martelo Unha 500g", category_id: 13, price: 40.0, costPrice: 28.0, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 23, name: "Chave de Fenda", category_id: 13, price: 15.0, costPrice: 10.0, minimunQuantity: 10, observation: "",totalQuantityInStock: 0, excludedStatus: false },
        { id: 24, name: "Chave Inglesa", category_id: 13, price: 60.0, costPrice: 45.0, minimunQuantity: 8, observation: "Alta durabilidade.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 25, name: "Serrote 24''", category_id: 13, price: 70.0, costPrice: 55.0, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: true },
        { id: 26, name: "Parafuso 3x25mm", category_id: 14, price: 10.0, costPrice: 7.0, minimunQuantity: 50, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 27, name: "Madeira Compensada", category_id: 10, price: 90.0, costPrice: 70.0, minimunQuantity: 10, observation: "Ideal para construção.", totalQuantityInStock: 0, excludedStatus: false },
        { id: 28, name: "Broca para Concreto", category_id: 13, price: 25.0, costPrice: 20.0, minimunQuantity: 5, observation: "", totalQuantityInStock: 0, excludedStatus: false },
        { id: 29, name: "Viga de Aço", category_id: 9, price: 300.0, costPrice: 250.0, minimunQuantity: 3, observation: "Para estruturas pesadas.", totalQuantityInStock: 0, excludedStatus: false },
      ],
    }),

    await prisma.batch.create({
      data: {
        product_id: 1, 
        quantity: 30,
        deletionStatus: false,
        expirationDate: "2024-05-21T00:00:01.000Z",
        eValidationStatus: 1,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 2,
        quantity: 15,
        deletionStatus: false,
        expirationDate: "2024-12-25T00:00:01.000Z",
        eValidationStatus: 3,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 3,
        quantity: 15,
        deletionStatus: false,
        eValidationStatus: 4,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 4,
        quantity: 7,
        deletionStatus: false,
        eValidationStatus: 4,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 5,
        quantity: 15,
        deletionStatus: false,
        eValidationStatus: 4,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 6,
        quantity: 9,
        deletionStatus: false,
        expirationDate: "2025-12-10T00:00:01.000Z",
        eValidationStatus: 3,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 7,
        quantity: 4,
        deletionStatus: false,
        expirationDate: "2024-11-10T00:00:01.000Z",
        eValidationStatus: 2,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 8,
        quantity: 4,
        deletionStatus: false,
        expirationDate: "2025-02-05T00:00:01.000Z",
        eValidationStatus: 3,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    await prisma.batch.create({
      data: {
        product_id: 9,
        quantity: 6,
        deletionStatus: false,
        eValidationStatus: 4,
      }
    }).then(async (element) => {
      await updateQuantityProduct(element.id, element.quantity)
    }),
    /*Create generic supplier*/
    await prisma.supplier.createMany({
      data: [
        {
          id: 1,
          name: "GenericSupplier",
          email: "GenericSupplierEmail@gmail.com",
          excludedStatus: false,
          phone: "14578955198",
        },
        {
          id: 2,
          name: "Fera Atacado",
          email: "feraatacado.54d@gmail.com",
          excludedStatus: false,
          phone: "(11)2142-7000",
        },
        {
          id: 3,
          name: "Fortlev",
          email: "fortlev.lt254@gmail.com",
          excludedStatus: false,
          phone: "(11)2651-2000",
        },
      ],
    }),
  ]);
} catch (error) {
  console.log(error);
}
const productsWithExpiration = [12, 13, 18, 19]; // IDs de produtos com validade na vida real

for (let i = 0; i < 60; i++) {
  const productId = 10 + (i % 20); // IDs variando entre 10 e 29
  const isBelowMinimum = Math.random() < 0.3; // 30% dos lotes terão quantidade abaixo da mínima
  const quantity = isBelowMinimum ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 50) + 10;

  // Verifica se o produto possui validade
  const hasExpiration = productsWithExpiration.includes(productId);
  let daysUntilExpiration: number | null = null;  // Definir o tipo como `number | null`

  // Calcula `daysUntilExpiration` somente se o produto possui validade
  if (hasExpiration) {
    daysUntilExpiration = i % 20 - 10;

    // Garante que `daysUntilExpiration` seja um valor positivo
    if (daysUntilExpiration <= 0) {
      daysUntilExpiration = Math.floor(Math.random() * 30) + 1; // Gera dias entre 1 e 30
    }
  }

  // Verifica se `daysUntilExpiration` não é nulo antes de usar
  const expirationDate = hasExpiration && daysUntilExpiration !== null
    ? new Date(Date.now() + daysUntilExpiration * 24 * 60 * 60 * 1000).toISOString()
    : null;
  let  eValidationStatus = 1
  // Determina o status de validação
  if(daysUntilExpiration != null){
    eValidationStatus = 
    hasExpiration && expirationDate
      ? daysUntilExpiration > 7
        ? 1 // Dentro da validade
        : daysUntilExpiration > 0
        ? 2 // Próximo do vencimento
        : 3 // Vencido
      : 1; // Produtos sem validade são sempre considerados dentro da validade
  }
  // Cria o lote no banco de dados
  await prisma.batch.create({
    data: {
      product_id: productId,
      quantity,
      deletionStatus: false,
      expirationDate,
      eValidationStatus: eValidationStatus,
    },
  });
}
