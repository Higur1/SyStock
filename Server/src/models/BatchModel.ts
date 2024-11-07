import { prisma } from "../config/prisma";
import IBatch from "../interface/IBatch";
import ILogProduct from "../interface/ILogProduct";
import IProduct from "../interface/IProduct";
import IUser from "../interface/IUser";

export default class BatchModel {
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
  static async create(batchData: IBatch) {
    try {
        const createBatch = await prisma.batch.create({
          data: {
            deletionStatus: false,
            expirationDate: batchData.expirantionDate,
            quantity: batchData.quantity,
            product_id: batchData.product_id,
            eValidationStatus: 1,
          },
        })
        return { status: true, batch: createBatch }
      } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByProduct(product_id: number) {
    try {
      const batchs = await prisma.batch.findMany({
        where: {
          AND: {
            product_id: product_id,
          },
        },
        select: {
          id: true,
          expirationDate: true,
          quantity: true,
        },
        orderBy:{
          expirationDate: 'asc'
        }
      });
      return batchs != undefined ? { status: true, batchs: batchs } : { status: true, batchs: []};
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async find(batchData: IBatch) {
    try {
      const batch = await prisma.batch.findFirst({
        where: {
          AND: [
            { expirationDate: batchData.expirantionDate },
            { product_id: batchData.product_id },
          ],
        },
      });
      return batch != null ? { status: true, batch: batch } : {status: true, batch: undefined};
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByExpirationDate(batchData: IBatch){
    try {
      const findResult = await prisma.batch.findFirst({
        where: {
          AND:[
            {expirationDate: batchData.expirantionDate},{ product_id: batchData.product_id}
          ]
          
        }
      })
      return findResult != null ? {status: true, batch: findResult } : {status: true, batch: undefined}
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async subQuantityGeneric(batchData: IBatch){
    try {
      const batchUpdated = await prisma.batch.update({
        data: {
          quantity: {
            decrement: batchData.quantity,
          },
        },
        where: {
          id: batchData.id,
        },
      });
      return { status: true, batch: batchUpdated };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async subQuantityDesc(batchData: IBatch){
    try {
      const batchUpdated = await prisma.batch.update({
        data: {
          quantity: {
            decrement: batchData.quantity,
          },
        },
        where: {
          id: batchData.id,
        },
      });
      return { status: true, batch: batchUpdated };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async addQuantity(batchData: IBatch) {
    try {
        const batchUpdated = await prisma.batch.update({
          data: {
            quantity: {
              increment: batchData.quantity,
            },
          },
          where: {
            id: batchData.id,
          },
        });
        return { status: true, batch: batchUpdated };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(batchData: IBatch) {
    try {
      await prisma.batch.delete({
        where: {
          id: batchData.id,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async setDateTheBatchWasCleared(batchData: IBatch){
    try {
      await prisma.batch.update({
        where: {
          id: batchData.id
        },
        data:{
          expirationDate: new Date()
        }
      })
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
