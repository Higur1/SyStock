import { prisma } from "../config/prisma";
import ISupplier from "../interface/ISupplier";

export default class SupplierModel {
  static async findAll() {
    try {
      const supplierResult = await prisma.supplier.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        where: {
          excludedStatus: false,
        },
      });
      return supplierResult != undefined
        ? { status: true, suppliers: supplierResult }
        : { status: true, suppliers: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async create(supplierData: ISupplier) {
    try { 
        const supplierResult = await prisma.supplier.create({
          data: {
            name: supplierData.name,
            email: supplierData.email,
            phone: supplierData.phone,
            excludedStatus: false,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        });
        return supplierResult != undefined
          ? {
            status: true,
            supplier: supplierResult,
          }
          : { status: true, supplier: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async find(supplierData: ISupplier) {
    try {
      const supplierResult = await prisma.supplier.findUnique({
        where: {
          id: supplierData.id,
          excludedStatus: false,
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
    };
  }; 
  static async findByName(supplierData: ISupplier) {
    try {
      const supplierResult = await prisma.supplier.findFirst({
        where: {
          AND: [
            { name: supplierData.name }, { excludedStatus: false }
          ]
        },
      });

      return supplierResult != undefined
        ? { status: true, exists: true, supplier: supplierResult }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByEmail(supplierData: ISupplier) {
    try {
      const supplierResult = await prisma.supplier.findFirst({
        where: {
          AND: [
            { email: supplierData.email }, { excludedStatus: false }
          ]
        },
      });
      return supplierResult != undefined
        ? { status: true, exists: true, supplier: supplierResult }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByPhone(supplierData: ISupplier) {
    try {
      const supplierResult = await prisma.supplier.findFirst({
        where: {
          AND: [
            { phone: supplierData.phone }, { excludedStatus: false }
          ]
        },
      });
      return supplierResult != undefined
        ? { status: true, exists: true, supplier: supplierResult }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findNameStartsWith(supplierData: ISupplier) {
    try {
      const supplierResult = await prisma.supplier.findMany({
        where: {
          name: {
            startsWith: supplierData.name,
          },
          excludedStatus: false,
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
        : { status: true, supplier: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async update(supplierData: ISupplier) {
    try {
      const supplier = await prisma.supplier.update({
        data: {
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
        },
        where: {
          id: supplierData.id,
          excludedStatus: false,
        },
      });
      return { supplier: supplier };
    } catch (error) {
      return { error: error };
    };
  };
  static async delete(supplierData: ISupplier) {
    try {
      await prisma.supplier.update({
        where: {
          id: supplierData.id,
        },
        data: {
          excludedStatus: true,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async deleteAll() {
    try {
      await prisma.supplier.updateMany({
        data: {
          excludedStatus: true,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
};
