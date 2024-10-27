import { error } from "console";
import { prisma } from "../config/prisma";
import Fill from "../models/Fill";
import Supplier from "../models/Supplier";

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
  static async create(fill: Fill) {
    try{
        fill.dateTime = new Date();
        fill.totalPrice = fill.calcTotalPrice(fill).totalPrice;
        const fillResult = await prisma.fill.create({
            data: {
              dateTime: fill.dateTime,
              observation: fill.observation,
              totalPrice: fill.totalPrice,
              createdAt: new Date(),
              updatedAt: new Date,
              supplier_id: fill.supplier_id,
              user_id: fill.user_id,
            }
        })
        if(fillResult != null){
            
        }
        return { status: true, fill: fill };
    }catch(error){
        return { status: false, error: error };
    }
  }
  static async getHistoryFill() {}
}
