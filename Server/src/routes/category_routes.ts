import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const CategorySchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
  },
};

export async function category_routes(app: FastifyInstance) {
  app.post("/categories/new", async (request, response) => {
    const category_name = z.object({
      name: z.string(),
    });
    const { name } = category_name.parse(request.body);

    try {
      await prisma.category
        .findFirst({
          where: {
            name: name,
          },
        })
        .then(async (nameExists) => {
          if (nameExists) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.category
            .create({
              data: {
                name: name,
              },
            })
            .then(async (category) => {
              response.status(201).send(category);
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
  app.get("/categories", async (request, response) => {
    try {
      await prisma.category.findMany().then((categories) => {
        if (Object.keys(categories).length === 0) {
          response.status(200).send("Empty");
        }
        response.status(200).send(categories);
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
  app.get("/categories/findByName/:name", async (request, response) => {
    const categories = z.object({
      name: z.string(),
    });
    const { name } = categories.parse(request.params);

    try {
      await prisma.category
        .findMany({
          where: {
            name: {
              startsWith: name,
            },
          },
        })
        .then((categories) => {
          if (Object.keys(categories).length === 0) {
            response.status(404).send("Not found");
          }
          response.status(200).send(categories);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/categories/findById/:id", async (request, response) => {
    const category_id = z.object({
      id: z.string(),
    });
    const { id } = category_id.parse(request.params);

    try {
      await prisma.category
        .findUnique({
          where: {
            id: Number(id),
          },
        })
        .then((categories) => {
          if (!categories) {
            response.status(404).send("Not Found");
          }
          response.status(200).send(categories);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.put("/categories/update", async (request, response) => {
    const category = z.object({
      id: z.number(),
      name: z.string(),
    });
    const { id, name } = category.parse(request.body);

    try {
      await prisma.category
        .findUnique({
          where: {
            id: id,
          },
        })
        .then(async (category) => {
          if (!category) {
            response.status(404).send("Not found");
          }
          await prisma.category
            .update({
              where: { id: id },
              data: { name: name },
            })
            .then(async (bodyReturn) => {
              await prisma.category.findFirst({
                where: {
                  id: id,
                },
              });
              response.status(200).send(bodyReturn);
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
  app.delete("/categories/delete", async (request, response) => {
    const category_id = z.object({
      id: z.number(),
    });
    const { id } = category_id.parse(request.body);

    try {
      await prisma.category
        .findUnique({
          where: {
            id: id,
          },
        })
        .then(async (category) => {
          if (!category) {
            response.status(404).send("Not found");
          }
          await prisma.category.delete({
            where: {
              id: id,
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
}
