import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { $ref } from "./user.schema";
export async function batch_product_routes(app: FastifyInstance) {
  app.post("/batch_product/new", async (request, response) => {
    const batch_product = z.object({
      batch_id: z.number(),
      product_id: z.number(),
      quantity: z.number(),
    });
    const { batch_id, product_id, quantity } = batch_product.parse(request.body);
    try {
      await prisma.batch_Product.findFirst({
        where: {
          batch_id: batch_id,
          product_id: product_id,
        },
      })
      .then(async (batchId_productId_Exists) => {
        if (batchId_productId_Exists) {
          response.status(200).send("an operation could not be performed");
        }
        await prisma.batch_Product
          .create({
            data: {
              batch_id: batch_id,
              product_id: product_id,
              quantity: quantity,
            },
          })
          .then(async (batch_product) => {
            response.status(201).send(batch_product);
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
  });
  app.get("/batchs", async (request, response) => {
    try {
      await prisma.batch_Product.findMany().then((list_Batch_Product) => {
        if (Object.keys(list_Batch_Product).length === 0) {
          response.status(200).send("Empty");
        }
        response.status(200).send(list_Batch_Product);
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
  app.post("/batchs/findById", async (request, response) => {
    const batch_product = z.object({
      batch_id: z.number(),
      product_id: z.number(),
    });
    const { batch_id, product_id } = batch_product.parse(request.params);

    try {
      await prisma.batch_Product
        .findFirst({
          where: { 
              batch_id: batch_id,
              product_id: product_id
          },
        })
        .then((batch_product) => {
          if (!batch_product) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batch_product);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/batch_product/batchs/:batch_id", async (request, response) => {
    const product = z.object({
      batch_id: z.number(),
    });
    const { batch_id } = product.parse(request.params);

    try {
      await prisma.batch_Product
        .findMany({
          where: {
            batch_id: Number(batch_id),
          },
        })
        .then((batchProductList) => {
          if (!batchProductList) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batchProductList);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/batch_product/products/:product_id", async (request, response) => {
    const product = z.object({
      product_id: z.number(),
    });
    const { product_id } = product.parse(request.params);

    try {
      await prisma.batch_Product
        .findMany({
          where: {
            product_id: Number(product_id),
          },
        })
        .then((batchProductList) => {
          if (!batchProductList) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batchProductList);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.delete("/batchs/delete", async (request, response) => {
    const batch_product = z.object({
      batch_id: z.number(),
      product_id:z.number(),
    });
    const { batch_id, product_id } = batch_product.parse(request.body);
    try {
      await prisma.batch_Product
        .findFirst({
          where: { 
            batch_id: batch_id,
            product_id: product_id,
          },
        })
        .then(async (batch_product) => {
          if (!batch_product) {
            response.status(200).send("Not found");
          }
          await prisma.$queryRaw`DELETE FROM batch_Product WHERE product_id = ${product_id} and batch_id = ${batch_id}`
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
