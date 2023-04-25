import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
export async function supplier_routes(app: FastifyInstance) {
  app.post("/suppliers/new", async (request, response) => {
    const supplier = z.object({
      company_name: z.string(),
      email: z.string(),
      cnpj: z.string(),
      state_registration: z.string(),
      phone: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string(),
      street: z.string(),
      number: z.number(),
      complement: z.string(),
    });
    const {
      company_name,
      email,
      cnpj,
      state_registration,
      phone,
      cep,
      city,
      state,
      street,
      number,
      complement,
    } = supplier.parse(request.body);

    try {
      await prisma.supplier
        .findFirst({
          where: { OR: [{ cnpj }, { email }] },
        })
        .then(async (supplier_exist) => {
          if (supplier_exist) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.supplier
            .create({
              data: {
                company_name: company_name,
                email: email,
                cnpj: cnpj,
                state_registration: state_registration,
                phone: phone,
              },
            })
            .then(async () => {
              await prisma.supplier
                .findFirst({
                  where: {
                    cnpj: cnpj,
                  },
                })
                .then(async (supplier_id) => {
                  await prisma.supplier_Address.create({
                    data: {
                      supplier_id: supplier_id!.id,
                      cep: cep,
                      city: city,
                      state: state,
                      street: street,
                      number: number,
                      complement: complement,
                    },
                  });
                });
            });
          response.status(201);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/suppliers", async (request, response) => {
    try {
      await prisma.$queryRaw`
            SELECT  
                S.id,
                S.company_name,
                S.email,
                S.cnpj,
                S.state_registration,
                S.phone,  
                SA.cep,
                SA.city,
                SA.state,
                SA.street,
                SA.number,
                SA.complement
            FROM suppliers S
            JOIN supplier_address SA
                ON S.id = SA.supplier_id
            `.then((supplier) => {
        if (!supplier) {
          response.status(200).send("an operation could not be performed");
        }
        response.status(200).send(supplier);
      });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/suppliers/findByName/:company_name", async (request, response) => {
    const supplier = z.object({
      company_name: z.string(),
    });

    const { company_name } = supplier.parse(request.params);

    try {
      await prisma.supplier
        .findMany({
          where: {
            company_name: {
              startsWith: company_name,
            },
          },
        })
        .then((supplier) => {
          if (Object.keys(supplier).length === 0) {
            response.status(200).send("Not found");
          }
          response.status(200).send(supplier);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/suppliers/findById/:supplier_id", async (request, response) => {
    const supplier = z.object({
      supplier_id: z.string(),
    });
    const { supplier_id } = supplier.parse(request.params);

    try {
      await prisma.supplier
        .findFirst({
          where: {
            id: Number(supplier_id),
          },
        })
        .then((supplier) => {
          if (!supplier) {
            response.status(200).send("Not found");
          }
          response.status(200).send(supplier);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/suppliers/findAddress/:supplier_id", async (request, response) => {
    const supplier_address_id = z.object({
      supplier_id: z.string(),
    });
    const { supplier_id } = supplier_address_id.parse(request.params);

    try {
      await prisma.supplier_Address
        .findUnique({
          where: {
            supplier_id: Number(supplier_id),
          },
        })
        .then((supplier_address) => {
          if (!supplier_address) {
            response.status(200).send("Not found");
          }
          response.status(200).send(supplier_address);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.put("/suppliers/update", async (request, response) => {
    const supplier = z.object({
      id: z.number(),
      company_name: z.string(),
      email: z.string(),
      cnpj: z.string(),
      state_registration: z.string(),
      phone: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string(),
      street: z.string(),
      number: z.number(),
      complement: z.string(),
    });
    const {
      id,
      company_name,
      email,
      cnpj,
      state_registration,
      phone,
      cep,
      city,
      state,
      street,
      number,
      complement,
    } = supplier.parse(request.body);

    try {
      await prisma.supplier
        .findUnique({
          where: {
            id: id,
          },
        })
        .then(async (supplier) => {
          if (!supplier) {
            response.status(200).send("Não encontrado");
          }
          await prisma.supplier
            .update({
              where: { id: id },
              data: {
                company_name: company_name,
                email: email,
                state_registration: state_registration,
                phone: phone,
              },
            })
            .then(async () => {
              await prisma.supplier_Address.update({
                where: { supplier_id: id },
                data: {
                  cep: cep,
                  city: city,
                  state: state,
                  street: street,
                  number: number,
                  complement: complement,
                },
              });
            });
          response.status(200);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
  app.delete("/suppliers/delete", async (request, response) => {
    const supplier_id = z.object({
      id: z.number(),
    });
    const { id } = supplier_id.parse(request.body);

    try {
      await prisma.supplier
        .findUnique({
          where: { id: id },
        })
        .then(async (user) => {
          if (!user) {
            response.status(200).send("Not found");
          }
          await prisma.supplier_Address.delete({
            where: { supplier_id: id },
          });
          await prisma.supplier.delete({
            where: { id: id },
          });
          response.status(200);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
}
