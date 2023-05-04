import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { $ref } from "./user.schema";
export async function product_routes(app: FastifyInstance) {
  app.post("/products/new",
    async (request, response) => {
    const product = z.object({
      name: z.string(),
      description: z.string(),
      ncmSh: z.string(),
      price: z.number(),
      category_id: z.number(),
      supplier_id: z.number(),
    });
    const { name, description, ncmSh, price, category_id, supplier_id } =
      product.parse(request.body);

    try {
      await prisma.product
        .findFirst({
          where: { ncmSh: ncmSh },
        })
        .then(async (ncmShExist) => {
          if (ncmShExist) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.product.create({
            data: {
              name: name,
              ncmSh: ncmSh,
              description: description,
              price: price,
              category_id: category_id,
              supplier_id: supplier_id,
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
  app.get("/products/findByName/:name", async (request, response) => {
    const product_name = z.object({
      name: z.string(),
    });
    const { name } = product_name.parse(request.params);

    try {
      await prisma.product
        .findMany({
          where: {
            name: {
              startsWith: name,
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
      name: z.string(),
      description: z.string(),
      ncmSh: z.string(),
      price: z.number(),
      category_id: z.number(),
      supplier_id: z.number(),
    });
    const { id, name, description, ncmSh, price, category_id, supplier_id } =
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
              name: name,
              description: description,
              ncmSh: ncmSh,
              price: price,
              category_id: category_id,
              supplier_id: supplier_id,
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
