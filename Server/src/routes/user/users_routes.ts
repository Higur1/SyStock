import { prisma } from "../../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import dotenv from "dotenv";
import auth_middleware from "../../middleware/auth_middleware";
import {
  LimitOfUsers,
  generatorHATEOAS,
  generatorPasswordCrypt,
  verifyTokenCompany,
} from "./user_controller";

dotenv.config();

export async function user_routes(app: FastifyInstance) {
  app.post("/user", async (request, response) => {
    const user = z.object({
      name: z
        .string()
        .trim()
        .min(5, "Name required minimum 5 chars")
        .max(20, "Name required Maximum 20 chars"),
      user_login: z
        .string()
        .trim()
        .min(5, "user_login required minimum 5 chars")
        .trim()
        .max(10, "user_login required maximum 10 chars")
        .trim(),
      user_password: z
        .string()
        .trim()
        .min(5, "user_password required minimum 5 chars")
        .max(10, "user_password required maximum 10 chars"),
      email: z.string().email("Valid e-mail required").trim(),
      user_type_id: z.number().gt(0),
      company_id: z.string().trim(),
    });
    const { name, user_login, user_password, email, user_type_id, company_id } =
      user.parse(request.body);
    try {
      await prisma.user
        .findFirst({
          where: {
            OR: [{ email: email }, { user_login: user_login }],
          },
        })
        .then(async (userExist) => {
          if (!userExist) {
            const isPossible = await LimitOfUsers(company_id, user_type_id);
            if (isPossible) {
              await prisma.user.create({
                data: {
                  name,
                  user_login,
                  user_password: generatorPasswordCrypt(user_password),
                  email,
                  user_type_id,
                  company_id: company_id,
                },
              }).then((user) => {
                const _links = generatorHATEOAS(user);
                response.send({
                  user: {
                    name: user.name,
                    user_login: user.user_login,
                    email: user.email,
                    company_id: user.company_id,
                  },
                  _links,
                });
              })
            }
            response.status(409).send({
              message: "it is not possible to create more users of type",
            });
          }
          response.status(409).send({
            message:
              "an operation could not be performed email or login already exists",
          });
        });
    } catch (error) {
      response.status(500).send({
        message: "An error has occurred",
        error: error
      });
    }
  });
  app.get("/users",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        const token = request.headers.authorization;

        await prisma.user
          .findMany({
            where: {
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              email: true,
              user_login: false,
              user_type_id: true,
            },
          })
          .then((userList) => {
            if (Object.keys(userList).length === 0) {
              response.status(204).send({ message: "Empty" });
            }
            var user = {
              user_name: " ",
              user_id: 0,
            };
            const _links = generatorHATEOAS(user);
            response.status(200).send({ users: userList, _links });
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.get("/user/:name",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        name: z
          .string()
          .trim()
          .min(1, "Name required minimum 1 char")
          .max(20, "Name required maximum 20 chars"), //arrumar o caracteres
      });

      const { name } = user.parse(request.params);
      const token = request.headers.authorization;
      try {
        await prisma.user
          .findMany({
            where: {
              name: {
                startsWith: name,
              },
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              email: true,
              user_type_id: true,
            },
          })
          .then((userExist) => {
            if (Object.keys(userExist).length === 0) {
              response.status(404).send({ message: "Not found" });
            }
            response.status(200).send({ users: userExist });
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.get("/user/",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.string().trim().min(1, "id required minimum 1 char"),
      });
      const token = request.headers.authorization;
      const { id } = user.parse(request.body);

      try {
        await prisma.user
          .findFirst({
            where: {
              id: Number(id),
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              email: true,
              user_type_id: true,
            },
          })
          .then((userExist) => {
            if (!userExist) {
              response.status(404).send({ message: "Not found" });
            }
            response.status(200).send({ user: userExist });
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.get("/users/:type_id",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        type_id: z
          .string()
          .trim()
          .min(1, "type_id required minimum 1 char")
          .max(1, "type_id required maximum 1 char"),
      });

      const { type_id } = user.parse(request.params);
      const token = request.headers.authorization;

      try {
        await prisma.user
          .findMany({
            where: {
              user_type_id: Number(type_id),
              company_id: String(verifyTokenCompany(token)),
            },
            select: {
              id: true,
              name: true,
              email: true,
              user_type_id: true,
            },
          })
          .then((userExist) => {
            if (!userExist) {
              response.status(404).send({ messsage: "Not found" });
            }
            response.status(200).send({ user: userExist });
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.put("/user",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.number().min(1, "id required minimum 1 char"),
        name: z
          .string()
          .trim()
          .min(1, "Name required minimum 1 char")
          .max(20, "Name required maximum 20 chars"),
        user_type_id: z
          .number()
          .min(1, "type_id required minimum 1 char")
          .max(3),
      });

      const { id, name, user_type_id } = user.parse(request.body);
      const token = request.headers.authorization;

      try {
        await prisma.user
          .findFirst({
            where: { id: id, company_id: String(verifyTokenCompany(token)) },
          })
          .then(async (user) => {
            if (!user) {
              response.status(404).send({ message: "Not found" });
            }
            await prisma.user.update({
              where: { id: id },
              data: {
                name: name,
                user_type_id: user_type_id,
              },
            });
            response.status(200);
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.delete("/user",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.number().min(1, "id required minimum 1 char"),
      });

      const { id } = user.parse(request.body);
      const token = request.headers.authorization;
      try {
        await prisma.user
          .findFirst({
            where: { id: id, company_id: String(verifyTokenCompany(token)) },
          })
          .then(async (userExist) => {
            if (!userExist) {
              response.status(404).send({ message: "Not found" });
            }
            await prisma.user.delete({
              where: { id: id },
            });
            response.status(200);
          });
      } catch (error) {
        response.status(500).send(
          JSON.stringify({
            message: "An error has occurred",
          })
        );
      }
    }
  );
}