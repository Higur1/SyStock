import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {dateBase} from "../src/functions/baseFunctions";

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
    prisma.pre_User.deleteMany(),
    prisma.user.deleteMany(),
    prisma.batch.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.supplier.deleteMany(),
    prisma.category.deleteMany(),
    prisma.eValitadionStatus.deleteMany(),
    prisma.eTypeAction.deleteMany(),
    prisma.eTypeUser.deleteMany(),
  ]);
  
  await Promise.all([
    /*Create type of users */
    prisma.eTypeUser.createMany({
      data: [
        {
          id: 1,
          type: "Admin",
        },
        {
          id: 2,
          type: "Funcionario"
        }
      ]
    }),
    prisma.pre_User.create({
      data:{
        email: "hgbsystemstock@gmail.com",
        name: "Admin HGB",
      }
    }),
    /*Create users */
    prisma.user.create({
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
  
    prisma.eValitadionStatus.createMany({
      data: [
        {
          id: 1,
          type: "Validade atingida"
        },
        {
          id: 2,
          type: "Validade proxima a ser atingida"
        },
        {
          id: 3,
          type: "Dentro da validade"
        },
      ]
    }),
    prisma.eTypeAction.createMany({  
      data: [
        {
          id: 1,
          type: "Incluido no sistema"
        },
        {
          id: 2,
          type: "Removido por venda"
        },
        {
          id: 3,
          type: "Removido por usuário"
        },
      ]
    }),
   
    /*Create generic category*/
    prisma.category.create({
      data: {
        id: 1,
        name: "GenericCategory",
      },
    }),
  
    /*Create generic supplier*/
     prisma.supplier.create({
      data: {
        id: 1,
        name: "GenericSupplier",
        email: "GenericSupplierEmail@gmail.com",
        excludedStatus: false,
        phone: "14578955198",
      },
    }),

    /*Create generic product*/
    prisma.product.create({
      data:{
        name: "GenericProduct",
        costPrice: 100,
        minimunQuantity: 10,
        totalQuantityInStock: 0,
        price: 200,
        observation: "Generic product",
        excludedStatus: false
      }
    }).then((productCreate) => {
      prisma.batch.create({
        data:{
          quantity: 10,
          deletionStatus: false,
          expirationDate: dateBase(),
          eValidationStatus: 1,
          product_id: productCreate.id
        }
      })
    })
  ])
} catch (error) {
  console.log(error)
}


  