import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { $ref } from "./user.schema";
export async function product_routes(app: FastifyInstance) {
  app.post("/products/new",
    async (request, response) => {
    const product = z.object({
      description: z.string(),
      ncmSh: z.string(),
      price: z.number(),
      category_id: z.number(),
    });
    const {description, ncmSh, price, category_id} =
      product.parse(request.body);

    try {
      await prisma.product
        .findFirst({
          where: { description: description },
        })
        .then(async (descriptionExists) => {
          if (descriptionExists) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.product.create({
            data: {
              ncmSh: ncmSh,
              description: description,
              price: price,
              category_id: category_id,
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
  app.get("/products", async (request, response) => {
    try {
      await prisma.product.findMany().then((listProduct) => {
        if (Object.keys(listProduct).length === 0) {
          response.status(200).send("Empty");
        }
        response.status(200).send(listProduct);
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
  app.get("/products/findByName/:description", async (request, response) => {
    const product_description = z.object({
      description: z.string(),
    });
    const { description } = product_description.parse(request.params);

    try {
      await prisma.product
        .findMany({
          where: {
            description: {
              startsWith: description,
            },
          },
        })
        .then((productList) => {
          if (Object.keys(productList).length === 0) {
            response.status(200).send("Not found");
          }
          response.status(200).send(productList);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/products/findById/:product_id", async (request, response) => {
    const product = z.object({
      product_id: z.string(),
    });
    const { product_id } = product.parse(request.params);

    try {
      await prisma.product
        .findUnique({
          where: { id: Number(product_id) },
        })
        .then((product) => {
          if (!product) {
            response.status(200).send("Not found");
          }
          response.status(200).send(product);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/products/category/:category_id", async (request, response) => {
    const category = z.object({
      category_id: z.string(),
    });
    const { category_id } = category.parse(request.params);

    try {
      await prisma.product
        .findMany({
          where: {
            category_id: Number(category_id),
          },
        })
        .then((productList) => {
          if (!productList) {
            response.status(200).send("Not found");
          }
          response.status(200).send(productList);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.put("/products/update", async (request, response) => {
    const product = z.object({
      id: z.number(),
      description: z.string(),
      ncmSh: z.string(),
      price: z.number(),
      category_id: z.number(),
    });
    const { id, description, ncmSh, price, category_id} =
      product.parse(request.body);

    try {
      await prisma.product
        .findFirst({
          where: { id: id },
        })
        .then(async (product) => {
          if (!product) {
            response.status(200).send("Not found");
          }
          await prisma.product.update({
            where: { id: id },
            data: {
              description: description,
              ncmSh: ncmSh,
              price: price,
              category_id: category_id,
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
  app.delete("/products/delete", async (request, response) => {
    const product = z.object({
      product_id: z.number(),
    });
    const { product_id } = product.parse(request.body);
    try {
      await prisma.product
        .findUnique({
          where: { id: product_id },
        })
        .then(async (product) => {
          if (!product) {
            response.status(200).send("Not found");
          }
          await prisma.product.delete({
            where: { id: product_id },
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
