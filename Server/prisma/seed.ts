import { PrismaClient } from "@prisma/client";
import { generatorPasswordCrypt } from "../src/routes/user/user_controller";

const prisma = new PrismaClient();



async function run() {
  async function resetId(tabela: string) {
    await prisma.$queryRaw`
            UPDATE 'sqlite_sequence'
            SET 'seq' = 0
            WHERE name = ${tabela}
        `;
  }
}
/*Delete*/await Promise.all([
    prisma.token_Recovery.deleteMany(),
    prisma.user.deleteMany(),
    prisma.user_Type.deleteMany(),
    prisma.company.deleteMany(),
    prisma.status_Company.deleteMany(),
    prisma.subscription_Plan.deleteMany()
])
  /*Create status company*/ await Promise.all([
    prisma.status_Company.create({
      data:{
        id: 1,
        status: "Active"
      }
    }),
    prisma.status_Company.create({
      data:{
        id: 2,
        status: "Unpaid"
      }
    }),
    prisma.status_Company.create({
      data:{
        id: 3,
        status: "Disabled"
      }
    })
  ])
  /*Create subscription plans*/ await Promise.all([
    prisma.subscription_Plan.create({
      data:{
        id: 1,
        name: "FREE",
        description: "1 USERS"
      }
    }),
    prisma.subscription_Plan.create({
      data:{
        id: 2,
        name: "BRONZE",
        description: "2 USERS"
      }
    }),
    prisma.subscription_Plan.create({
      data:{
        id: 3,
        name: "PRATA",
        description: "3 USERS"
      }
    })
  ])
  /*Create generic company*/ await Promise.all([
    prisma.company.create({
      data:{
        id: "uuidfake",
        name: "Generic",
        cnpj: "00.000.000/0001-00",
        status_company_id: 1,
        subscription_plans: 3 
      }
    })
  ])
  /*Create type of users */ await Promise.all([
    prisma.user_Type.create({
      data:{
        id: 1,
        name: "Admin"
      }
    }),
    prisma.user_Type.create({
      data:{
        id: 2,
        name: "Supervisor"
      }
    }),
    prisma.user_Type.create({
      data:{
        id: 3,
        name: "Common"
      }
    })
  ])
  /*Create users */ await Promise.all([
    prisma.user.create({
      data:{
        id: 1,
        company_id:"uuidfake",
        user_type_id: 1,
        user_login: "admin",
        email: "hgbsystemstock@gmail.com",
        name:"Admin HGB",
        user_password: generatorPasswordCrypt("HGB"),
      }
    })
  ])
  