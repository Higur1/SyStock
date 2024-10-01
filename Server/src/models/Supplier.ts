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
        where:{
          excludedStatus: false
        }
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
          excludedStatus: false
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
          excludedStatus: false
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
  static async findByName(supplier_name) {
    try {
      const supplierResult = await prisma.supplier.findMany({
        where: {
          name: {
            startsWith: supplier_name,
          },
          excludedStatus: false
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
          excludedStatus: false
        },
      });
      return { supplier: supplier };
    } catch (error) {
      return { error: error };
    }
  }
  static async validatedSupplierExists(supplierObject) {
    try {
      let message = "";
      const validSupplier = await prisma.supplier.findFirst({
        where: {
          id: supplierObject.id,
          excludedStatus: false
        },
      });
      message += validSupplier == null ? "O fornecedor não existe" : "";

      return message.length == 0
        ? { status: true, exists: true }
        : { status: true, exists: false, message: message };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async validatedSupplierData(supplierObject) {
    try {
      let message = "";
      const validNameSupplier = await prisma.supplier.findFirst({
        where: {
          name: supplierObject.name,
        },
      });
      const validEmailSupplier = await prisma.supplier.findFirst({
        where: {
          email: supplierObject.email,
        },
      });
      const validPhoneSupplier = await prisma.supplier.findFirst({
        where: {
          phone: supplierObject.phone,
        },
      });
      message +=
        validNameSupplier == null ? "" : "nome já cadastrado no sistema | ";

      message +=
        validEmailSupplier == null ? "" : "email já cadastrado no sistema | ";

      message +=
        validPhoneSupplier == null ? "" : "phone já cadastrado no sistema";

      return message.length == 0
        ? { status: true, isValid: true }
        : { status: true, isValid: false, message: message };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(supplier_id) {
    try {
      await prisma.supplier.update({
        where: {
          id: supplier_id,
        },
        data:{
          excludedStatus: true
        }
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
