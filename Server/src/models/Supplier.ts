import { prisma } from "../config/prisma";

export default class Supplier {
  static async findAll(company_id) {
    try {
      const supplierResult = await prisma.supplier.findMany({
        where: {
          company_id: company_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          Phone: {
            select: {
              id: true,
              phone: true,
            },
          },
          Address: {
            select: {
              id: true,
              cep: true,
              street: true,
              number: true,
              district: true,
              state: true,
              city: true,
              complement: true,
            },
          },
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
      let supplierIsCreated = {};
      await prisma.$transaction(async (result) => {
        const supplier = await prisma.supplier.create({
          data: {
            name: supplierObject.name,
            email: supplierObject.email,
            company_id: supplierObject.company_id,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        const first_phone = await prisma.phone.create({
          data: {
            phone: supplierObject.phones[0],
            company_id: supplierObject.company_id,
            supplier_id: supplier.id,
          },
          select: {
            id: true,
            phone: true,
            supplier_id: true,
          },
        });
        const second_phone = await prisma.phone.create({
          data: {
            phone: supplierObject.phones[1],
            company_id: supplierObject.company_id,
            supplier_id: supplier.id,
          },
          select: {
            id: true,
            phone: true,
            supplier_id: true,
          },
        });
        const address = await prisma.address.create({
          data: {
            company_id: supplierObject.company_id,
            supplier_id: supplier.id,
            cep: supplierObject.address.cep,
            street: supplierObject.address.street,
            number: supplierObject.address.number,
            district: supplierObject.address.district,
            state: supplierObject.address.state,
            city: supplierObject.address.city,
            complement: supplierObject.address.complement,
          },
          select: {
            id: true,
            company_id: false,
            supplier_id: true,
            cep: true,
            street: true,
            number: true,
            district: true,
            state: true,
            city: true,
            complement: true,
          },
        });
        supplierIsCreated = {
          supplier,
          Phones: { first_phone, second_phone },
          address,
        };
      });
      return supplierIsCreated != undefined
        ? { status: true, supplier: supplierIsCreated }
        : { status: true, supplier: undefined };
    } catch (error) {
      console.log(error);
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
          Phone: {
            select: {
              id: true,
              phone: true,
            },
          },
          Address: {
            select: {
              cep: true,
              street: true,
              number: true,
              district: true,
              state: true,
              city: true,
              complement: true,
            },
          },
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
        data:{
          name: supplierObject.name,
          email: supplierObject.email
        },
        where:{
          id: supplierObject.id
        }
      })
      return supplier != null ? {status: true, supplier: supplier} : {status: true, supplier: {}};
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updateAddress(supplierObject){
    try {
      const address = await prisma.address.update({
        data:{
          cep: supplierObject.address.cep,
          street: supplierObject.address.street,
          number: supplierObject.address.number,
          district: supplierObject.address.district,
          state: supplierObject.address.state,
          city: supplierObject.address.city,
          complement: supplierObject.address.complement
        },
        where:{
          id: supplierObject.address.id
        },
        select:{
          id: true,
          cep: true,
          street: true,
          number: true,
          district: true,
          state: true,
          city: true,
          complement: true,
          supplier_id: true
        }
      })
      return address != null ? {status: true, address: address} : {status:true, address:{}};
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updatePhones(supplierObject){
    try {
      const first_phone = await prisma.phone.update({
        data:{phone: supplierObject.phones[0].phone},
        where:{id: supplierObject.phones[0].id},
        select:{id: true, phone:true}
      });
      const second_phone = await prisma.phone.update({
        data:{phone: supplierObject.phones[1].phone},
        where:{id: supplierObject.phones[1].id},
        select:{id:true, phone: true}
      })
      return {status: true, phone:{first_phone, second_phone} }
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async validatedSupplierData(supplierObject){
    try {
      let message = "";
      const validSupplier = await prisma.supplier.findFirst({
        where:{
          id: supplierObject.id
        }
      });
      message += (validSupplier == null) ? "could not update supplier, " : "" 
      const validAddress = await prisma.address.findFirst({
        where:{
          id: supplierObject.address.id,
          supplier_id: supplierObject.id
        }
      });
      message += (validAddress == null) ? "could not update address, " : "" 
      const validFirstPhone = await prisma.phone.findFirst({
        where:{
          id: supplierObject.phones[0].id,
          supplier_id: supplierObject.id
        }
      });
      const validSecondPhone = await prisma.phone.findFirst({
        where:{
          id: supplierObject.phones[1].id,
          supplier_id: supplierObject.id
        }
      });
      message += (validFirstPhone == null || validSecondPhone == null) ? "could not update phones " : "" 
      return message.length == 0 ? {status: true, isValid: true} : {status: true, isValid: false, message:message};
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(supplier_id) {
    try {
      const verifyAddress = await prisma.address.findFirst({
        where: {
          supplier_id: supplier_id,
        },
      });
      const verifyPhones = await prisma.phone.findFirst({
        where: {
          supplier_id: supplier_id,
        },
      });
      if (verifyAddress != null) {
        await prisma.address.deleteMany({
          where: {
            supplier_id: supplier_id,
          },
        });
      }
      if (verifyPhones != null) {
        await prisma.phone.deleteMany({
          where: {
            supplier_id: supplier_id,
          },
        });
      }
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
