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
        {
          id: 1,
          type: "Admin",
        },
        {
          id: 2,
          type: "Funcionario",
        },
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
        {
          id: 1,
          type: "dataValidadeAtingida",
        },
        {
          id: 2,
          type: "dataValidadeProximaASerAtingida",
        },
        {
          id: 3,
          type: "dentroDaValidade",
        },
        {
          id: 4,
          type: "não possui validade",
        },
      ],
    }),
    await prisma.eTypeAction.createMany({
      data: [
        {
          id: 1,
          type: "Incluido no sistema",
        },
        {
          id: 2,
          type: "Removido por venda",
        },
        {
          id: 3,
          type: "Removido por usuário",
        },
      ],
    }),

    /*Create categories*/
    await prisma.category.createMany({
      data: [
        {
          id: 1,
          name: "GenericCategory",
        },
        {
          id: 2,
          name: "Argamassa",
        },
        {
          id: 3,
          name: "Caixas d'água",
        },
        {
          id: 4,
          name: "Cimento",
        },
        {
          id: 5,
          name: "Rejuntes",
        },
        {
          id: 6,
          name: "Telha de Plástico",
        },
      ],
    }),

    await prisma.product.createMany({
      data: [
        {
          id: 1,
          name: "Argamassa ACIII Interno e Externo Cinza 20kg Votoran",
          category_id: 2,
          price: 39.0,
          costPrice: 23.55,
          minimunQuantity: 5,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 2,
          name: "Argamassa Porcelanato Interno e Externo Cinza 20kg Axton",
          category_id: 2,
          price: 27.5,
          costPrice: 16.53,
          minimunQuantity: 5,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 3,
          name: "Caixa d'água Polietileno 1.000L Azul Fortlev",
          category_id: 3,
          price: 349.9,
          costPrice: 209.94,
          minimunQuantity: 2,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 4,
          name: "Caixa d'água Polietileno 500L Azul Fortlev",
          category_id: 3,
          price: 209.9,
          costPrice: 125.94,
          minimunQuantity: 2,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 5,
          name: "Tanque + Green 500L Acqualimp",
          category_id: 3,
          price: 379.9,
          costPrice: 265.93,
          minimunQuantity: 1,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 6,
          name: "Cimento CP II F 32 Todas as Obras 50kg Votoran",
          category_id: 4,
          price: 31.9,
          costPrice: 23.92,
          minimunQuantity: 6,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 7,
          name: "Rejunte Cimentício Aditivado Cinza Platina 1 Kg Axton",
          category_id: 5,
          price: 16.0,
          costPrice: 8.41,
          minimunQuantity: 8,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 8,
          name: "Rejunte Acrílico Rejunte Base Plástica Branco 1kg Axton",
          category_id: 5,
          price: 28.0,
          costPrice: 18.27,
          minimunQuantity: 6,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
        {
          id: 9,
          name: "Telha de Polipropileno Ondulada 50x153cm 1,1mm Translúcida Atco",
          category_id: 6,
          price: 36.0,
          costPrice: 18.03,
          minimunQuantity: 5,
          observation: "",
          totalQuantityInStock: 0,
          excludedStatus: false,
        },
      ],
    }),

    /*Create categories*/
    await prisma.batch.createMany({
      data: [
        {
          product_id: 1,
          quantity: 30,
          deletionStatus: false,
          expirationDate: "2024-01-01T00:00:01.000Z",
          eValidationStatus: 1,
        },
        {
          product_id: 2,
          quantity: 15,
          deletionStatus: false,
          expirationDate: "2024-12-25T00:00:01.000Z",
          eValidationStatus: 3,
        },
        {
          product_id: 6,
          quantity: 9,
          deletionStatus: false,
          expirationDate: "2024-12-10T00:00:01.000Z",
          eValidationStatus: 3,
        },
        {
          product_id: 7,
          quantity: 4,
          deletionStatus: false,
          expirationDate: "2024-11-10T00:00:01.000Z",
          eValidationStatus: 2,
        },
        {
          product_id: 8,
          quantity: 4,
          deletionStatus: false,
          expirationDate: "2025-02-05T00:00:01.000Z",
          eValidationStatus: 3,
        },
        {
          product_id: 3,
          quantity: 15,
          deletionStatus: false,
          eValidationStatus: 4,
        },
        {
          product_id: 4,
          quantity: 7,
          deletionStatus: false,
          eValidationStatus: 4,
        },
        {
          product_id: 5,
          quantity: 15,
          deletionStatus: false,
          eValidationStatus: 4,
        },
        {
          product_id: 9,
          quantity: 6,
          deletionStatus: false,
          eValidationStatus: 4,
        },
      ],
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
