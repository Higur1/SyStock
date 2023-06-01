import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
export async function supplier_routes(app: FastifyInstance) {
  app.post("/suppliers/new", async (request, response) => {
    const supplier = z.object({
      name: z.string(),
      company_id: z.number(),
      phone: z.string(),
      email: z.string(),
    });
    const { name, company_id, phone, email } = supplier.parse(request.body);

    try {
      await prisma.supplier
        .findFirst({
          where: {
            email: email,
          },
        })
        .then(async (supplier_exist) => {
          if (supplier_exist) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.supplier
            .create({
              data: {
                company_id: company_id,
                name: name,
                email: email,
              },
            })
            .then(async (supplier) => {
              await prisma.supplierPhone.create({
                data: {
                  phone: phone,
                  supplier_id: supplier.id,
                },
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
     await prisma.supplier.findMany({
      include:{
        Phones:{}
      }
     })
      .then(async (supplier) => {
        if (!supplier) {
          response.status(404).send("Not found");
        }
        response.status(200).send(supplier);
      });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/suppliers/findByName/:name", async (request, response) => {
    const supplier = z.object({
      name: z.string(),
    });

    const { name } = supplier.parse(request.params);

    try {
      await prisma.supplier
        .findMany({
          where: {
            name: {
              startsWith: name,
            },
          },
        })
        .then((supplier) => {
          if (Object.keys(supplier).length === 0) {
            response.status(404).send("Not found");
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
            response.status(404).send("Not found");
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
  app.put("/suppliers/update", async (request, response) => {
    const supplier = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      company_id: z.number(),
    });
    const { id, email, name, phone, company_id } = supplier.parse(request.body);

    try {
      await prisma.supplier
        .findUnique({
          where: {
            id: id,
          },
        })
        .then(async (supplier) => {
          if (!supplier) {
            response.status(404).send("Not found");
          }
          await prisma.supplier
            .findFirst({
              where: {
                email: email,
              },
            })
            .then(async (emailExists) => {
              if (emailExists) {
                response.status(200).send("Email alredy exists");
              }
              await prisma.supplier
                .update({
                  where: { id: id },
                  data: {
                    name: name,
                    email: email,
                    company_id: company_id,
                  },
                })
                .then(async (supplier) => {
                  await prisma.$queryRaw`
              UPDATE supplier_phone
              SET phone = ${phone}
              WHERE supplier_id = ${supplier.id}
            `;
                  response.status(200).send(supplier);
                });
            });
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
            response.status(404).send("Not found");
          }
          await prisma.supplierPhone.delete({
            where: { id: id },
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
