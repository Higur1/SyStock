import { prisma } from "../config/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { $ref } from "./user.schema";
export async function batch_routes(app: FastifyInstance) {
  app.post("/batch/new", async (request, response) => {
    const batch = z.object({
      number: z.string(),
      supplier_id: z.number(),
    });
    const { number, supplier_id } = batch.parse(request.body);

    try {
      await prisma.batch
        .findFirst({
          where: {
            number: number,
          },
        })
        .then(async (numberExists) => {
          if (numberExists) {
            response.status(200).send("an operation could not be performed");
          }
          await prisma.batch.
            create({
              data: {
                number: number,
                supplier_id: supplier_id,
              },
            })
            .then(async(batch) => {
              response.status(201).send(batch);
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
      await prisma.batch.findMany().then((listbatch) => {
        if (Object.keys(listbatch).length === 0) {
          response.status(200).send("Empty");
        }
        response.status(200).send(listbatch);
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
  app.get("/batchs/findByNumber/:number", async (request, response) => {
    const batch_number = z.object({
      number: z.string(),
    });
    const { number } = batch_number.parse(request.params);

    try {
      await prisma.batch
        .findMany({
          where: {
            number: {
              startsWith: number,
            },
          },
        })
        .then((batchList) => {
          if (Object.keys(batchList).length === 0) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batchList);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/batchs/findById/:batch_id", async (request, response) => {
    const batch = z.object({
      batch_id: z.number(),
    });
    const { batch_id } = batch.parse(request.params);

    try {
      await prisma.batch
        .findUnique({
          where: { id: Number(batch_id) },
        })
        .then((batch) => {
          if (!batch) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batch);
        });
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          mensagem: "An error has occurred",
        })
      );
    }
  });
  app.get("/batchs/supplier/:supplier_id", async (request, response) => {
    const supplier = z.object({
      supplier_id: z.string(),
    });
    const { supplier_id } = supplier.parse(request.params);

    try {
      await prisma.batch
        .findMany({
          where: {
            supplier_id: Number(supplier_id),
          },
        })
        .then((batchList) => {
          if (!batchList) {
            response.status(200).send("Not found");
          }
          response.status(200).send(batchList);
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
    const batch = z.object({
      batch_id: z.number(),
    });
    const { batch_id } = batch.parse(request.body);
    try {
      await prisma.batch
        .findUnique({
          where: { id: batch_id },
        })
        .then(async (batch) => {
          if (!batch) {
            response.status(200).send("Not found");
          }
          await prisma.batch.delete({
            where: { id: batch_id },
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
