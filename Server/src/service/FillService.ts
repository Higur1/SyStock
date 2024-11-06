import { prisma } from "../config/prisma";
import Fill from "../models/Fill";
import Supplier from "../models/Supplier";
import User from "../models/User";

export default class FillService {
  static async findAll() {
    try {
      const fills = await prisma.fill.findMany({
        orderBy: { dateTime: "desc" },
      });
      return { status: true, fills: fills };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findById(fill: Fill) {
    try {
      const fillFinded = await prisma.fill.findUnique({
        where: { id: fill?.id },
      });
      return { status: true, fill: fillFinded };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findBySupplierName(supplier: Supplier) {
    try {
      const supplierFinded = await prisma.supplier.findFirst({
        where: { name: supplier.name },
      });
      const fillFinded = await prisma.fill.findMany({
        where: { supplier_id: supplierFinded?.id },
      });
      return { status: true, fill: fillFinded };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(fill: Fill, user: User) {
    try {
      fill.dateTime = new Date();
      fill.totalPrice = fill.calcTotalPrice(fill).totalPrice;
      const fillResult = await prisma.fill.create({
        data: {
          dateTime: fill.dateTime,
          observation: fill.observation,
          totalPrice: fill.totalPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
          supplier_id: fill.supplier_id,
          user_id: fill.user_id,
        },
      });
      if (fillResult != null) {
        const logFillCreated = await prisma.logFill.create({
          data: {
            fill: {
              connect: { id: fillResult.id },
            },
            user: {
              connect: { id: fillResult.id },
            },
          },
        });
        const batchFillPromises = fill.batchs_fills.map(async (batch_fill) => {
          return await prisma.batch_Fill.create({
            data: {
              costPrice: batch_fill.costPrice,
              quantity: batch_fill.quantity,
              subTotal: batch_fill.subtotal,
              createdAt: new Date(),
              fill_id: batch_fill.fill.id == undefined ? 0 : batch_fill.fill.id,
              batch_id:
                batch_fill.batch.id == undefined ? 0 : batch_fill.batch.id,
              updatedAt: new Date(),
            },
          });
        });
        await Promise.all(batchFillPromises);
      }
      return { status: true, fill: fillResult };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async getHistoryFill() {}
}
