import { existsSync } from "fs";
import { prisma } from "../config/prisma";
import Batch from "../models/Batch";
import LogProduct from "../models/LogProduct";
import Product from "../models/Product";
import User from "../models/User";

export default class BatchService {
  static async findAll() {
    try {
      const batchs = await prisma.batch.findMany({
        where: {
          deletionStatus: false,
        },
      });
      return { status: true, batchs: batchs };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(batchData: Batch, user: User) {
    try {
      const batchResult = await prisma.batch.findFirst({
        where: {
          AND: [
            { product_id: batchData.product_id },
            { expirationDate: batchData.expirantionDate },
          ],
        },
      });
      if (batchResult == null) {
        console.log("entrou" + ``)
        const createBatch = await prisma.batch.create({
          data: {
            deletionStatus: false,
            expirationDate: batchData.expirantionDate,
            quantity: batchData.quantity,
            product_id: batchData.product_id,
            eValidationStatus:
              batchData.eValidationStatus == undefined
                ? 0
                : batchData.eValidationStatus,
          },
        });
        const product = await prisma.product.findFirst({
          where: { id: batchData.product_id },
        });
        if (product != null) {
          const logProduct = new LogProduct({
            dateTime: new Date(),
            eTypeAction: 1,
            quantity: batchData.quantity,
            motivo: "",
            user: user,
            product: {
              id: product.id,
              name: product.name,
              category_id:
                product.category_id != null ? product.category_id : 0,
              costPrice: product.costPrice,
              minimunQuantity: product.minimunQuantity,
              price: product.price,
              observation: product.observation,
              totalQuantityInStock: product.totalQuantityInStock,
            },
          });
          await prisma.logProduct.create({
            data: {
              product: {
                connect: { id: logProduct.product.id },
              },
              eTypeAction: logProduct.eTypeAction,
              motivo: logProduct.motivo,
              quantity: logProduct.quantity,
              user: {
                connect: { id: logProduct.user.id },
              },
              dateTime: logProduct.dateTime,
            },
          });
        }
        return { status: true, batch: createBatch };
      } else {
        return {
          status: true,
          error: "not possible create batch, batch exists",
        };
      }
    } catch (error) {
      console.log(error)
      return { status: false, error: error };
    }
  }
  static async verifyAlternDeletationStatusForTrueWhenBatchExists(
    batch: Batch
  ) {
    if (batch.quantity == 0) {
      const result = this.alternDeletationStatusForTrueInBD(batch);
      if ((await result).status) {
        batch.deletationStatus = true;
      }
    }
    return batch;
  }
  static async alternDeletationStatusForTrueInBD(batch: Batch) {
    try {
      await prisma.batch.update({
        where: {
          id: batch.id,
        },
        data: {
          deletionStatus: true,
        },
      });
      return { status: true, mensagem: "update deletation status" };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async verifyAlternDeletationStatusWhenBatchNotExists(batch: Batch) {
    if (batch.quantity == 0) {
      batch.deletationStatus = true;
    } else {
      batch.deletationStatus = false;
    }
    return batch;
  }
  static async findByProduct(batchData: Batch) {
    try {
      const batch = await prisma.batch.findMany({
        where: {
          AND: {
            product_id: batchData.product_id,
          },
        },
        select: {
          expirationDate: true,
          quantity: true,
        },
      });
      return { status: true, batch: batch };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findBatch(batchData: Batch) {
    try {
      const batch = await prisma.batch.findFirst({
        where: {
          AND: [
            { expirationDate: batchData.expirantionDate },
            { product_id: batchData.product_id },
          ],
        },
      });
      return { status: true, batch: batch };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(batchData: Batch, operation: number) {
    try {
      const findBatch = await this.findBatch(batchData);
      if (!findBatch.batch) {
        return { status: true, error: "batch not found" };
      }
      if (operation == 2 && findBatch.batch.quantity < batchData.quantity) {
        return {
          status: true,
          error: "Insufficient stock to withdraw quantity",
        };
      }
      let batchUpdated;

      if (operation == 1) {
        batchUpdated = await prisma.batch.update({
          data: {
            quantity: {
              increment: batchData.quantity,
            },
          },
          where: {
            id: findBatch.batch?.id,
          },
        });
      } else {
        batchUpdated = await prisma.batch.update({
          data: {
            quantity: {
              decrement: batchData.quantity,
            },
          },
          where: {
            id: findBatch.batch?.id,
          },
        });
      }
      return { status: true, batch: batchUpdated };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(batchData: Batch) {
    try {
      const batchResult = await prisma.batch.delete({
        where: {
          id: batchData.id,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async searchForExpirationDate(batchData: Batch) {
    try {
      const batchResult = await prisma.batch.findFirst({
        where: {
          AND: [
            { product_id: batchData.product_id },
            { expirationDate: batchData.expirantionDate },
          ],
        },
      });
      return batchResult != undefined
        ? { status: true, find: true, batch: batchResult }
        : { status: true, find: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async verifyBatchAlredyExists(batch: Batch) {
    try {
      const batchResult = await prisma.batch.findFirst({
        where: {
          AND: {
            product_id: batch.product_id,
            expirationDate: batch.expirantionDate,
          },
        },
      });
      return batchResult != undefined
        ? { status: true, exists: true, batch_id: batchResult!.id }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
