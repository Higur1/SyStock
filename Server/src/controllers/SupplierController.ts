import { z } from "zod";
import Supplier from "../models/Supplier";
import { verifyTokenCompany } from "../functions/verifyTokenCompany";

export default class SupplierController {
  static async findAll(request, response) {
    try {
      const company_id = verifyTokenCompany(request.headers.authorization);
      const suppliers = await Supplier.findAll(company_id);

      if (suppliers.status) {
        response.status(200).send(
          JSON.stringify({
            suppliers: suppliers.suppliers,
          })
        );
      } else {
        response.status().send(
          JSON.stringify({
            error: suppliers.error,
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
        phones: z
          .array(z.string().trim().min(14).max(16).optional())
          .min(1)
          .max(2),
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

      const company_id = verifyTokenCompany(request.headers.authorization);
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
        },
        company_id: company_id,
      };

      const supplierCreated = await Supplier.create(supplier);
      if (supplierCreated?.status) {
        if (supplierCreated.supplier != undefined) {
          response.status(201).send(
            JSON.stringify(supplierCreated.supplier)
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
  static async findBatchs(request, response) {
    try {
      const supplier = z.object({
        supplier_id: z.string().min(36).max(36),
      });

      const { supplier_id } = supplier.parse(request.params);
      const company_id = verifyTokenCompany(request.headers.authorization);

      const listBatch = await Supplier.getBatchs(supplier_id, company_id);

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
  static async update(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.string().trim().min(36).max(36),
        name: z.string().trim().min(5).max(20),
        email: z.string().email(),
        phones: z
          .array(z.string().trim().min(14).max(16).optional())
          .min(1)
          .max(2),
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
      const company_id = verifyTokenCompany(request.headers.authorization);
      const { id, name, email, phones, address } = supplierValidation.parse(
        request.body
      );
      const supplier = {
        id: id,
        name: name,
        email: email,
        phones: [phones[0], phones[1]],
        address: {
          cep: address.cep,
          street: address.street,
          number: address.number,
          district: address.district,
          state: address.state,
          city: address.city,
          complement: address.complement,
        },
        company_id: company_id,
      };

      const supplierUpdated = await Supplier.updateSupplier(supplier);

      response.status(200).send(
        JSON.stringify(supplierUpdated.supplier)
      );
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
