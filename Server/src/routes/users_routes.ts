import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { $ref } from "./user.schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth_middleware from "../middleware/auth_middleware";

dotenv.config();

export async function user_routes(app: FastifyInstance) {
  app.post("/auth", async (request, response) => {
    const user = z.object({
      user_login: z.string(),
      user_password: z.string(),
    });
    const { user_login, user_password } = user.parse(request.body);

    try {
      await prisma.user
        .findUnique({
          where: {
            user_login: user_login,
          },
        })
        .then(async (user) => {
          if (!user) {
            response.status(404).send("Not found");
          }
          await bcrypt
            .compare(user_password, user!.user_password)
            .then(async (checkpassword) => {
              if (!checkpassword) {
                response.status(401).send("Unauthorized");
              }
              const knowkey = process.env.JWTSecret;
              const token = jwt.sign(
                { id: user?.id, email: user?.email },
                knowkey!,
                { expiresIn: "48h" }
              );

              response.status(200).send(token);
            });
        });
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error.meta,
          message: "An error has occurred",
        })
      );
    }
  });
  app.post(
    "/users/new",
    {
      preHandler: auth_middleware,
    },
    async (request, response) => {
      const user = z.object({
        name: z.string(),
        user_login: z.string(),
        user_password: z.string(),
        email: z.string(),
        user_type_id: z.number(),
      });
      const { name, user_login, user_password, email, user_type_id } =
        user.parse(request.body);

      try {
        await prisma.user
          .findFirst({
            where: { OR: [{ email: email }, { user_login: user_login }] },
          })
          .then(async (userExist) => {
            if (userExist) {
              response
                .status(422)
                .send(
                  "an operation could not be performed email or login already exists"
                );
            }
            var salt = await bcrypt.genSaltSync(10);
            var hash = await bcrypt.hashSync(user_password, salt);
            await prisma.user
              .create({
                data: {
                  name: name,
                  user_login: user_login,
                  user_password: hash,
                  email: email,
                  user_type_id: user_type_id,
                },
              })
              .then((user) => {
                response
                  .status(201)
                  .send({
                    user: {
                      id: user.id,
                      user_login: user.user_login,
                      email: user.email,
                      type: user.user_type_id,
                    },
                  });
              });
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error.meta,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.get(
    "/users",
    { preHandler: auth_middleware },
    async (request, response) => {
      try {
        await prisma.user
          .findMany({
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
              response.status(200).send("Empty");
            }
            response.status(200).send(userList);
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            error: error,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.get(
    "/users/findByName/:name",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        name: z.string(),
      });

      const { name } = user.parse(request.params);

      try {
        await prisma.user
          .findMany({
            where: {
              name: {
                startsWith: name,
              },
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
              response.status(404).send("Not found");
            }
            response.status(200).send(userExist);
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.get(
    "/users/findById/:id",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.string(),
      });

      const { id } = user.parse(request.params);

      try {
        await prisma.user
          .findUnique({
            where: {
              id: Number(id),
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
              response.status(404).send("Not found");
            }
            response.status(200).send(userExist);
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.get(
    "/users/findByType/:type_id",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        type_id: z.string(),
      });

      const { type_id } = user.parse(request.params);

      try {
        await prisma.user
          .findMany({
            where: {
              user_type_id: Number(type_id),
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
              response.status(404).send("Not found");
            }
            response.status(200).send(userExist);
          });
      } catch (error) {
        response.status(400).send(
          JSON.stringify({
            mensagem: "An error has occurred",
          })
        );
      }
    }
  );
  app.put(
    "/users/update",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.number(),
        name: z.string(),
        user_type_id: z.number(),
      });

      const { id, name, user_type_id } = user.parse(request.body);

      try {
        await prisma.user
          .findUnique({
            where: { id: id },
          })
          .then(async (user) => {
            if (!user) {
              response.status(404).send("Not found");
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
        response.status(400).send(
          JSON.stringify({
            error: error.meta.target,
            message: "An error has occurred",
          })
        );
      }
    }
  );
  app.delete(
    "/users/delete",
    { preHandler: auth_middleware },
    async (request, response) => {
      const user = z.object({
        id: z.number(),
      });

      const { id } = user.parse(request.body);

      try {
        await prisma.user
          .findUnique({
            where: { id: id },
          })
          .then(async (userExist) => {
            if (!userExist) {
              response.status(404).send("Not found");
            }
            await prisma.user.delete({
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
    }
  );
}
