import { z } from "zod";
import Supplier from "../models/Supplier";

export default class SupplierController {
  static async findAll(request, response) {
    try {
      const suppliers = await Supplier.findAll();
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
        phone: z.string().trim().min(11).max(11),
      });

      const { name, email, phone } = supplierValidation.parse(request.body);
      const supplier = {
        name: name,
        email: email,
        phone: phone,
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
      // COMO ESTAVA ANTES
      /*
      const supplierValidation = z.object({
        id: z.string().trim().min(36).max(36),
      });
      */
      const supplierValidation = z.object({
        id: z.string(),
      });
      const { id } = supplierValidation.parse(request.params);

      const supplierFound = await Supplier.findById(Number(id));

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
  static async update(request, response) {
    try {
      const supplierValidation = z.object({
//        id: z.string().trim().min(36).max(36),
        id: z.string(),
        name: z.string().trim().min(5).max(20),
        email: z.string().email(),
        phone: z.string().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { id, name, email, phone } = supplierValidation.parse(
        request.body
      );
      const supplier = {
        id: Number(id),
        name: name,
        email: email,
        phone: phone,
      };
      const validData = await Supplier.validatedSupplierData(supplier);
      if (validData.status) {
        if (validData.isValid) {
          const supplierUpdated = await Supplier.updateSupplier(supplier);
          response.status(200).send(
            JSON.stringify({
              supplier: supplierUpdated.supplier,
            })
          );
        } else {
          response.status(404).send(
            JSON.stringify({
              error: validData.message,
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: validData.error,
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
//        id: z.string().trim().min(36).max(36),
        id: z.string()
      });
      const { id } = supplierValidation.parse(request.body);
      const supplierDeleted = await Supplier.delete(Number(id));

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
