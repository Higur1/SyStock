import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { $ref } from "./user.schema";
export async function company_routes(app: FastifyInstance) {
  app.post("/companies/new", async (request, response) => {
    const company = z.object({
      cnpj: z.string(),
      name: z.string(),
      email: z.string(),
      state_registration: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string(),
      number: z.number(),
      complement: z.string(),
      street: z.string(),
    });
    const {
      cnpj,
      name,
      email,
      state_registration,
      cep,
      city,
      state,
      number,
      complement,
      street,
    } = company.parse(request.body);

    try {
      await prisma.company
        .findFirst({
          where: {
            cnpj: cnpj,
          },
        })
        .then(async (cnpjExists) => {
          if (cnpjExists) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.company
            .create({
              data: {
                name: name,
                cnpj: cnpj,
                email: email,
                state_registration: state_registration,
              },
            })
            .then(async (company) => {
              await prisma.company_Address
                .create({
                  data: {
                    cep: cep,
                    city: city,
                    complement: complement,
                    number: number,
                    state: state,
                    street: street,
                    company_id: company.id,
                  },
                })
                .then((company_address) => {
                  response.status(201).send([company, company_address]);
                });
            });
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.target.meta,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/companies", async (request, response) => {
    try {
      await prisma.company.findMany({
        include:{
          Company_Address:{},
          Company_Phones:{}
        }
      })
      .then(
        async (company) => {
          if (!company) {
            response.status(404).send("Not found");
          }
          response.status(200).send(company);
        }
      );
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/companies/findById/:id", async (request, response) => {
    const company = z.object({
      id: z.string(),
    });
    const { id } = company.parse(request.params);

    try {
      await prisma.company.findFirst({
        where:{
          id: Number(id)
        },
        include:{
          Company_Address:{},
          Company_Phones:{}
        }
      }).then((company) => {
        if (!company) {
          response.status(404).send("Not found");
        }
        response.status(200).send(company);
      });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.put("/companies/update", async (request, response) => {
    const company = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      state_registration: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string(),
      number: z.number(),
      complement: z.string(),
      street: z.string(),
    });
    const {
      id,
      name,
      email,
      state_registration,
      cep,
      city,
      state,
      number,
      complement,
      street,
    } = company.parse(request.body);

    try {
      await prisma.company
        .findFirst({
          where: {
            id: id,
          },
        })
        .then(async (company) => {
          if (!company) {
            response.status(404).send("Not found");
          }
          await prisma.company
            .update({
              where: {
                id: id,
              },
              data: {
                name: name,
                email: email,
                state_registration: state_registration,
              },
            })
            .then(async (company) => {
              await prisma.company_Address
                .findFirst({
                  where: {
                    company_id: id,
                  },
                })
                .then(async (company_address_id) => {
                  await prisma.company_Address
                    .update({
                      where: {
                        id: company_address_id!.id,
                      },
                      data: {
                        cep: cep,
                        city: city,
                        state: state,
                        number: number,
                        complement: complement,
                        street: street,
                      },
                    })
                    .then((companyaddress) => {
                      response.status(200).send([company, companyaddress]);
                    });
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
  app.delete("/companies/delete", async (request, response) => {
    const company = z.object({
      id: z.number(),
    });
    const { id } = company.parse(request.body);
    try {
      await prisma.company
        .findFirst({
          where: { id: id },
        })
        .then(async (company) => {
          if (!company) {
            response.status(404).send("Not found");
          }
          await prisma.company_Address
            .findFirst({
              where: {
                company_id: id,
              },
            })
            .then(async (companyaddress_id) => {
              await prisma.company_Address.delete({
                where: {
                  id: companyaddress_id!.id,
                },
              });
              await prisma.company.delete({
                where: {
                  id: id,
                },
              });
              response.status(200);
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

  app.post("/companiesPhone/new", async (request, response) => {
    const company = z.object({
      phone: z.string(),
      company_id: z.number(),
    });
    const { phone, company_id } = company.parse(request.body);

    try {
      await prisma.company_Phone
        .findFirst({
          where: {
            phone: phone,
          },
        })
        .then(async (companyPhone) => {
          if (companyPhone) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.company_Phone
            .create({
              data: {
                phone: phone,
                company_id: company_id,
              },
            })
            .then(async (companyPhone) => {
              response.status(201).send(companyPhone);
            });
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/companiesPhone", async (request, response) => {
    try {
      await prisma.company_Phone.
      findMany()
      .then(async (companyPhoneList) => {
        if (Object.keys(companyPhoneList).length === 0) {
          response.status(200).send("Empty");
        }
        response.status(200).send(companyPhoneList);
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
  app.get("/companiesPhone/findByCompanies/:company_id", async (request, response) => {
    const company = z.object({
      company_id: z.string(),
    });
    const { company_id } = company.parse(request.params);
    try {
      await prisma.company_Phone.
      findMany({
        where: {
          company_id: Number(company_id),
        },
      })
      .then(async (companyPhoneList) => {
        if (!companyPhoneList) {
          response.status(200).send("Not found");
        }
        response.status(200).send(companyPhoneList);
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
  app.put("/companiesPhone/update", async (request, response) => {
    const companyPhone = z.object({
      id: z.number(),
      phone: z.string(),
    });
    const { id, phone } = companyPhone.parse(request.body);

    try {
      await prisma.company_Phone
        .findUnique({
          where: {
            id: id,
          },
        })
        .then(async (companyPhone) => {
          if (!companyPhone) {
            response.status(200).send("Not found");
          }
          await prisma.company_Phone
            .findFirst({
              where: {
                phone: phone,
              },
            })
            .then(async (phoneExists) => {
              if (phoneExists) {
                response.status(200).send("Phone alredy exists");
              }
              await prisma.company_Phone
                .update({
                  where: { id: id },
                  data: {
                    phone: phone,
                  },
                })
                .then(async (companyPhone) => {
                  response.status(200).send(companyPhone);
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
  app.delete("/companiesPhone/delete", async (request, response) => {
    const companyPhone_id = z.object({
      id: z.number(),
    });
    const { id } = companyPhone_id.parse(request.body);

    try {
      await prisma.company_Phone
        .findUnique({
          where: { id: id },
        })
        .then(async (companyPhone) => {
          if (!companyPhone) {
            response.status(200).send("Not found");
          }
          await prisma.company_Phone.delete({
            where: { id: id }
          })
          response.status(200).send(companyPhone);
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