import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { $ref} from "./user.schema";

export async function user_routes(app: FastifyInstance) {
  app.post("/users/new", {
    schema:{
      body: $ref("createUserSchema"),
      response:{
        201: $ref("userResponseSchema")
      }
    }
  },async (request, response) => {
    const user = z.object({
      name: z.string(),
      user_login: z.string(),
      user_password: z.string(),
      email: z.string(),
      user_type_id: z.number(),
    });
    const { name, user_login, user_password, email, user_type_id } = user.parse(
      request.body
    );

    try {
      await prisma.user
        .findFirst({
          where: { OR: [{ email: email }, { user_login: user_login }] },
        })
        .then(async (userExist) => {
          if (userExist) {
            response.status(200).send("an operation could not be performed");
          }
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(user_password, salt);
          await prisma.user.create({
            data: {
              name: name,
              user_login: user_login,
              user_password: hash,
              email: email,
              user_type_id: user_type_id,
            },
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
  app.get("/users", async (request, response) => {
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
          error: error.meta.target,
          message: "An error has occurred",
        })
      );
    }
  });
  app.get("/users/findByName/:name", async (request, response) => {
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
            response.status(200).send("Not found");
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
  });
  app.get("/users/findById/:id", async (request, response) => {
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
            response.status(200).send("Not found");
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
  });
  app.get("/users/findByType/:type_id", async (request, response) => {
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
            response.status(200).send("Not found");
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
  });
  app.put("/users/update", async (request, response) => {
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
            response.status(200).send("Not found");
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
  });
  app.delete("/users/delete", async (request, response) => {
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
            response.status(200).send("Not found");
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
  });
}
