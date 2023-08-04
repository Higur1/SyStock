import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../config/prisma";
import { verifyTokenCompany } from "../user/user_controller";
import auth_middleware from "../../middleware/auth_middleware";

export async function categories_routes(app: FastifyInstance) {
  app.post("/category",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        const category_name = z.object({
          name: z.string().trim().min(2).max(10),
        });
        const { name } = category_name.parse(request.body);
        await prisma.category
          .findFirst({
            where: {
              name: name.toUpperCase(),
            },
          })
          .then(async (categoryExists) => {
            if (categoryExists) {
              response.status(200).send({
                message:
                  "A operation could not be performed because category already exists",
              });
            } else {
              const token = request.headers.authorization;
              await prisma.category
                .findMany({
                  where: {
                    company_id: String(verifyTokenCompany(token)),
                  },
                })
                .then(async (countCategory) => {
                  if (countCategory.length <= 9) {
                    await prisma.category
                      .create({
                        data: {
                          name: name.toUpperCase(),
                          company_id: String(verifyTokenCompany(token)),
                        },
                      })
                      .then((category) => {
                        response
                          .status(201)
                          .send({ id: category.id, name: category.name });
                      });
                  } else {
                    response
                      .status(200)
                      .send({ message: "maximum limit of categories reached" });
                  }
                });
            }
          })
          .catch((error) => {
            response
              .status(200)
              .send({ message: "An error has ocurred", error: error });
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error.meta.target,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.get("/categories",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        const token = request.headers.authorization;
        await prisma.category
          .findMany({
            where: {
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              company_id: false,
            },
          })
          .then((listCategories) => {
            const categories = Object.keys(listCategories).length;
            if (categories > 0) {
              response.status(200).send(listCategories);
            } else {
              response.status(200).send({ message: "Empty" });
            }
          })
          .catch((error) => {
            response
              .status(200)
              .send({ message: "An error has occurred", error: error });
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error.meta.target,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.get("/categories/:name",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        const categories = z.object({
          name: z.string().trim().min(1).max(10),
        });
        const { name } = categories.parse(request.params);
        const token = request.headers.authorization;

        await prisma.category
          .findFirst({
            where: {
              name: {
                startsWith: name.toUpperCase(),
              },
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              company_id: false,
            },
          })
          .then((listCategories) => {
            if (listCategories) {
              response.status(200).send(listCategories);
            } else {
              response.status(404).send({ message: "Not Found" });
            }
          })
          .catch((error) => {
            response
              .status(200)
              .send({ message: "An error has occurred", error: error });
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error.meta.target,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.put("/category",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        const category = z.object({
          id: z.number().gt(0),
          name: z.string().trim().min(2).max(10),
        });
        const { id, name } = category.parse(request.body);
        const token = request.headers.authorization;

        await prisma.category
          .findFirst({
            where: {
              id: id,
              company_id: String(verifyTokenCompany(token)),
            },
          })
          .then(async (category) => {
            if (category) {
              await prisma.category
                .findFirst({
                  where: {
                    company_id: String(verifyTokenCompany(token)),
                    name: name.toUpperCase(),
                  },
                })
                .then(async (categoryExists) => {
                  if (!categoryExists) {
                    await prisma.category
                      .update({
                        where: {
                          id: id,
                        },
                        data: {
                          name: name.toUpperCase(),
                        },
                      })
                      .then((categoryUpdated) => {
                        response.status(200).send(categoryUpdated);
                      })
                      .catch((error) => {
                        response
                          .status(200)
                          .send({
                            message: "An erro has occurred",
                            error: error,
                          });
                      });
                  } else {
                    response
                      .status(200)
                      .send({
                        message:
                          "Is not possible because category name alredy exists",
                      });
                  }
                });
            } else {
              response.status(200).send({ message: "Not Found" });
            }
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error.meta.target,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.delete("/category",
   { preHandler: auth_middleware }, async (request, response) =>{
    try {
        const category_id = z.object({
            id: z.number().gt(0)
        });
        const {id} = category_id.parse(request.body);
        const token = request.headers.authorization;
        await prisma.category.findFirst({
            where:{
                id: id,
                company_id: String(verifyTokenCompany(token))
            }
        }).then(async (category) =>{
            if(!category){
                response.status(404).send({message: "Not Found"});
            }else{
                await prisma.category.delete({
                    where:{
                        id: id,
                    }
                }).then(() =>{
                    response.status(200).send({message: "category deleted"});
                }).catch((error) =>{
                    response.status(200).send({message: "An error has occurred", error: error});
                })
            }
        })
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
