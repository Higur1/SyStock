import { prisma } from "../config/prisma";

export default class Supplier {
  static async findAll() {
    try {
      const supplierResult = await prisma.supplier.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
      return supplierResult != undefined
        ? { status: true, suppliers: supplierResult }
        : { status: true, suppliers: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(supplierObject) {
    try {
      const supplierResult = await prisma.supplier.create({
        data: {
          name: supplierObject.name,
          email: supplierObject.email,
          phone: supplierObject.phone,
        },
      });
      return supplierResult != undefined
        ? {
            status: true,
            supplier: supplierResult,
          }
        : { status: true, supplier: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findById(supplier_id) {
    try {
      const supplierResult = await prisma.supplier.findUnique({
        where: {
          id: supplier_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
      return supplierResult != undefined
        ? { status: true, supplier: supplierResult }
        : { status: true, supplier: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updateSupplier(supplierObject) {
    try {
      const supplier = await prisma.supplier.update({
        data: {
          name: supplierObject.name,
          email: supplierObject.email,
          phone: supplierObject.phone,
        },
        where: {
          id: supplierObject.id,
        },
      });
      return supplier != null
        ? { status: true, supplier: supplier }
        : { status: true, supplier: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async validatedSupplierData(supplierObject) {
    try {
      let message = "";
      const validSupplier = await prisma.supplier.findFirst({
        where: {
          id: supplierObject.id,
        },
      });
      message += validSupplier == null ? "could not update supplier, " : "";

      return message.length == 0
        ? { status: true, isValid: true }
        : { status: true, isValid: false, message: message };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(supplier_id) {
    try {
      await prisma.supplier.delete({
        where: {
          id: supplier_id,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
