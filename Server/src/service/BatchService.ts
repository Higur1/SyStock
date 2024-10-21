import { existsSync } from "fs";
import { prisma } from "../config/prisma";
import Batch from "../models/Batch";

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
  static async create(batchData: Batch) {
    try {
      const verifyBatchExistst = await BatchService.verifyBatchAlredyExists(
        batchData
      );

      if (verifyBatchExistst.exists) {
        batchData.id = verifyBatchExistst.batch_id;
        const batchUpdated = await prisma.batch.update({
          where: {
            id: batchData.id,
          },
          data: {
            quantity: {
              increment: batchData.quantity,
            },
          },
        });
        batchData.deletationStatus = (
          await this.verifyAlternDeletationStatusForTrueWhenBatchExists(
            batchData
          )
        ).deletationStatus;
        return { status: true, message: "Update quantity" };
      } else {
        batchData.deletationStatus =
          (await this.verifyAlternDeletationStatusWhenBatchNotExists(batchData)).deletationStatus;
        const batchResult = await prisma.batch.create({
          data: {
            expirationDate: batchData.expirantionDate,
            quantity: batchData.quantity,
            deletionStatus: batchData.deletationStatus == undefined ? false : batchData.deletationStatus,
            product_id: batchData.product_id,
            eValidationStatus:
              batchData.eValidationStatus == undefined
                ? 0
                : batchData.eValidationStatus
          },
        });
        return { status: true, batch: batchResult };
      }
    } catch (error) {
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
  static async verifyAlternDeletationStatusWhenBatchNotExists(
    batch: Batch
  ) {
    if (batch.quantity == 0) {
      batch.deletationStatus=true;
     
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
          id: batchData.id,
        },
      });
      return { status: true, batch: batch };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(batchData: Batch) {
    try {
      const findBatch = await this.findBatch(batchData);
      const batchUpdated = await prisma.batch.update({
        data: {
          quantity: batchData.quantity,
        },
        where: {
          id: findBatch.batch?.id,
        },
      });
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
