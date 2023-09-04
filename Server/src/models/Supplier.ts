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
  static async getBatchs(supplier_id, company_id) {
    try {
      const batchs = await prisma.batch.findMany({
        where: {
          AND: {
            supplier_id: supplier_id,
            company_id: company_id,
          },
        },
      });
      return batchs != null
        ? { status: true, batchs: batchs }
        : { status: true, batchs: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updateSupplier(supplierObject) {
    try {
      const findAddres = await prisma.address.findFirst({
        where: {
          supplier_id: supplierObject.id,
        },
      });
      const findPhones = await prisma.phone.findMany({
        where: {
          AND: {
            company_id: supplierObject.company_id,
            supplier_id: supplierObject.id,
          },
        },
      });
      const [supplier, address, first_phone, second_phone] =
        await prisma.$transaction([
          prisma.supplier.update({
            data: {
              name: supplierObject.name,
              email: supplierObject.email,
            },
            where: {
              id: supplierObject.id,
            },
          }),

          prisma.address.update({
            data: {
              cep: supplierObject.address.cep,
              street: supplierObject.address.street,
              number: supplierObject.address.number,
              district: supplierObject.address.district,
              state: supplierObject.address.state,
              city: supplierObject.address.city,
              complement: supplierObject.address.complement,
            },
            where: {
              id: findAddres!.id,
            },
          }),

          prisma.phone.update({
            data: {
              phone: supplierObject.phones[0],
            },
            where: {
              id: findPhones[0].id,
            },
          }),

          prisma.phone.update({
            data: {
              phone: supplierObject.phones[1],
            },
            where: {
              id: findPhones[1].id,
            },
          }),
        ]);
        
      return supplier != null &&
        address != null &&
        first_phone != null &&
        second_phone != null
        ? {
            status: true,
            supplier: {
              supplier: supplier,
              address: address,
              phones: { first_phone: first_phone, second_phone: second_phone },
            },
          }
        : { status: true, supplier: {} };
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
