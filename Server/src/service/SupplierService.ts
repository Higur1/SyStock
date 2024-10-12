import { prisma } from "../config/prisma";
import Supplier from "../models/Supplier";

export default class SupplierService {
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
          excludedStatus: false
        }
      });
      return supplierResult != undefined
        ? { status: true, suppliers: supplierResult }
        : { status: true, suppliers: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async create(supplierData: Supplier) {
    try {
      const supplierVerify = await SupplierService.verifySupplierAlredyExists(supplierData);
      console.log(supplierVerify)
      if(!supplierVerify.exists){
        const supplierResult = await prisma.supplier.create({
          data: {
            name: supplierData.name,
            email: supplierData.email,
            phone: supplierData.phone,
            excludedStatus: false
          },
        });
        return supplierResult != undefined
        ? {
          status: true,
          supplier: supplierResult,
        }
        : { status: true, supplier: {} };
      }else{
        return {status: true, message: "Supplier alredy exists"}
      };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findById(supplierData: Supplier) {
    try {
      const supplierResult = await prisma.supplier.findUnique({
        where: {
          id: supplierData.id,
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
    };
  };
  static async findByName(supplierData: Supplier) {
    try {
      const supplierResult = await prisma.supplier.findMany({
        where: {
          name: {
            startsWith: supplierData.name,
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
        : { status: true, supplier: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async update(supplierData: Supplier) {
    try {
      const supplier = await prisma.supplier.update({
        data: {
          name: supplierData.name,
          email: supplierData.email,
          phone: supplierData.phone,
        },
        where: {
          id: supplierData.id,
          excludedStatus: false
        },
      });
      return { supplier: supplier };
    } catch (error) {
      return { error: error };
    };
  };
  static async validatedSupplierExists(supplierData: Supplier) {
    try {
      const validSupplier = await prisma.supplier.findFirst({
        where: {
          id: supplierData.id,
          excludedStatus: false
        },
      });

      return validSupplier != null
        ? { status: true, exists: true }
        : { status: true, exists: false};
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async validatedSupplierData(supplierData: Supplier) {
    try {
      let message = "";
      const validNameSupplier = await prisma.supplier.findFirst({
        where: {
          name: supplierData.name,
        },
      });
      const validEmailSupplier = await prisma.supplier.findFirst({
        where: {
          email: supplierData.email,
        },
      });
      const validPhoneSupplier = await prisma.supplier.findFirst({
        where: {
          phone: supplierData.phone,
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
    };
  };
  static async delete(supplierData: Supplier) {
    try {
      await prisma.supplier.update({
        where: {
          id: supplierData.id,
        },
        data: {
          excludedStatus: true
        }
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async deleteAll() {
    try {
      await prisma.supplier.deleteMany();
      return { status: true }
    } catch (error) {
      return {status: false, error: error}
    };
  };
  static async verifySupplierAlredyExists(supplierData: Supplier){
    try {
      const supplierResult = await prisma.supplier.findFirst({
        where:{
          OR:[
            {
              name: supplierData.name
            },
            {
              email: supplierData.email
            },
            {
              phone: supplierData.phone
            }
          ]
        }
      });

      return supplierResult != null ? {status: true, exists: true, supplier: supplierResult} : {status: true, exists: false}
    } catch (error) {
      return {status:false, error:error}
    };
  };
};
