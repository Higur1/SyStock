import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const salt = bcrypt.genSaltSync(10);


async function resetId() {
  await prisma.$queryRaw`
          UPDATE 'sqlite_sequence'
          SET 'seq' = 0
      `;
}

resetId();


/*Delete */ await prisma.$transaction([
  prisma.token_Recovery.deleteMany(),
  prisma.user.deleteMany(),
  prisma.eTypeUser.deleteMany(),
  //prisma.user_Type.deleteMany(),
//  prisma.batch.deleteMany(),
//  prisma.product.deleteMany(),
  //prisma.category.delete({ where: {id:1}}),
//  prisma.supplier.deleteMany(),
//  prisma.category.deleteMany(),
]);

await Promise.all([
  /*Create type of users */
  prisma.eTypeUser.create({
    data: {
      id: 1,
      type: "Admin",
    },
  }),
  prisma.eTypeUser.create({
    data: {
      id: 2,
      type: "Funcionario",
    },
  }),

  /*Create users */
  prisma.user.create({
    data: {
      id: 1,
      user_type: 1,
      login: "admin HGB",
      email: "hgbsystemstock@gmail.com",
      name: "Admin HGB",
      password: bcrypt.hashSync("Admin HGB", salt),
      excludedStatus: false,
    },
  }),

  prisma.eValitadionStatus.create({
    data: {
      id: 1,
      type: "dataValidadeAtingida"
    },
  }),
    prisma.eValitadionStatus.create({  
    data: {
      id: 2,
      type: "dataValidadeProximaASerAtingida"
    },
  }),
  prisma.eValitadionStatus.create({  
    data: {
      id: 3,
      type: "dentroDaValidade"
    },
  })

  /*Create generic category*/
/*  prisma.category.create({
    data: {
      id: 1,
      name: "Generic",
      excludedStatus: false
    },
  }),*/

  /*Create generic supplier*/
/*  prisma.supplier.create({
    data: {
      id: 1,
      name: "Generic",
      email: "GenericEmail@gmail.com",
      excludedStatus: false,
      phone: "14578955198",

    },
  });
*/
])
  