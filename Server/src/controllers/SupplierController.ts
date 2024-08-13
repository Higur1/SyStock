import { z } from "zod";
import Supplier from "../models/Supplier";

export default class SupplierController {
  static async findAll(request, response) {
    try {
      const suppliers = await Supplier.findAll();

      if(suppliers.status){
        response.status(200).send(
            JSON.stringify({
                suppliers: suppliers.suppliers
            })
        )
      }else{
        response.status().send(
            JSON.stringify({
                error: suppliers.error
            })
        );
      }
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error,
        })
      );
    }
  }
  static async create(request, response) {
    try {
      const supplierValidation = z.object({
        name: z.string().trim().min(5).max(20),
        email: z.string().email(),
        phones: z.array(z.string().trim().min(14).max(16)).min(1).max(2),
        address: z.object({
          cep: z.string().trim().min(9).max(9),
          street: z.string().trim().min(5).max(250),
          number: z.number().positive(),
          district: z.string().trim().min(5).max(250),
          state: z.string().trim().min(2).max(2),
          city: z.string().trim().min(5).max(30),
          complement: z.string().optional(),
        }),
      });

      const { name, email, phones, address } = supplierValidation.parse(
        request.body
      );
      const supplier = {
        name: name,
        email: email,
        phones: phones,
        address: {
          cep: address.cep,
          street: address.street,
          number: address.number,
          district: address.district,
          state: address.state,
          city: address.city,
          complement: address.complement,
        }
      };
    
      const supplierCreated = await Supplier.create(supplier);
      if (supplierCreated?.status) {
        if (supplierCreated.supplier != undefined) {
          response.status(201).send(
            JSON.stringify({
              supplier: supplierCreated.supplier,
            })
          );
        } else {
          response.status(500).send(
            JSON.stringify({
              error: "An error has occurred",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: supplierCreated.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
  static async findById(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.string().trim().min(36).max(36),
      });

      const { id } = supplierValidation.parse(request.params);

      const supplierFound = await Supplier.findById(id);

      if (supplierFound.status) {
        if (supplierFound.supplier != undefined) {
          response.status(200).send(
            JSON.stringify({
              supplier: supplierFound.supplier,
            })
          );
        } else {
          response.status(500).send(
            JSON.stringify({
              error: "An error has occurred",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: supplierFound.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
<<<<<<< Updated upstream
=======
  static async findBatchs(request, response) {
    try {
      const supplier = z.object({
        supplier_id: z.string().min(36).max(36),
      });

      const { supplier_id } = supplier.parse(request.params);

      const listBatch = await Supplier.getBatchs(supplier_id);

      if (listBatch.status) {
        if (listBatch.batchs != undefined) {
          response.status(200).send(
            JSON.stringify(listBatch.batchs)
          );
        } else {
          response.status(400).send(
            JSON.stringify({
              message: "Not found",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: listBatch.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
>>>>>>> Stashed changes
  static async update(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.string().trim().min(36).max(36),
        name: z.string().trim().min(5).max(20),
        email: z.string().email(),
        phones: z.array(z.object({
          id: z.number().positive(),
          phone: z.string().min(14).max(16)
        })).min(1).max(2),
        address: z.object({
          id: z.number().positive(),
          cep: z.string().trim().min(9).max(9),
          street: z.string().trim().min(5).max(250),
          number: z.number().positive(),
          district: z.string().trim().min(5).max(250),
          state: z.string().trim().min(2).max(2),
          city: z.string().trim().min(5).max(30),
          complement: z.string().optional(),
        }),
      });
<<<<<<< Updated upstream

      const company_id = verifyTokenCompany(request.headers.authorization);
=======
>>>>>>> Stashed changes
      const { id, name, email, phones, address } = supplierValidation.parse(
        request.body
      );
      const supplier = {
        id: id,
        name: name,
        email: email,
        phones: [
          {id:phones[0].id, phone:phones[0].phone},
          {id:phones[1].id, phone: phones[1].phone}
        ],
        address: {
          id: address.id,
          cep: address.cep,
          street: address.street,
          number: address.number,
          district: address.district,
          state: address.state,
          city: address.city,
          complement: address.complement,
        }
      };
      const validData = await Supplier.validatedSupplierData(supplier);
      if(validData.status){
        if(validData.isValid){
          const supplierUpdated = await Supplier.updateSupplier(supplier);
          const addressUpdated = await Supplier.updateAddress(supplier);
          const phonesUpdated = await Supplier.updatePhones(supplier);
          response.status(200).send(
            JSON.stringify({
                supplier: supplierUpdated.supplier,
                phones: {
                  first_phone: phonesUpdated.phone?.first_phone,
                  second_phone: phonesUpdated.phone?.second_phone
                },
                address: addressUpdated.address,
            })
          );
        }else{
          response.status(404).send(
            JSON.stringify({
              error: validData.message
            })
          );
        }
      }else{
        response.status(500).send(
          JSON.stringify({
            error: validData.error
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
  static async delete(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.string().trim().min(36).max(36),
      });
      const { id } = supplierValidation.parse(request.body);

      const supplierDeleted = await Supplier.delete(id);

      if (supplierDeleted.status) {
        response.status(200);
      } else {
        response.status(500).send(
          JSON.stringify({
            error: supplierDeleted.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
}
