import { z } from "zod";
import Supplier from "../models/Supplier";
import { error } from "console";

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
        name: z.string().trim().min(3).max(51),
        email: z.string().email(),
        phone: z.string().trim().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { name, email, phone } = supplierValidation.parse(request.body);
      const supplier = {
        name: name,
        email: email,
        phone: phone,
      };

      const supplierCreated = await Supplier.create(supplier);
      if (supplierCreated?.status) {
        //if (supplierCreated.supplier != undefined) {
        response.status(201).send(
          JSON.stringify({
            supplier: supplierCreated.supplier,
          })
        );
      }
      if (supplierCreated.error.meta.target.includes("name")) {
        response.status(400).send(
          JSON.stringify({
            error: "nome já está cadastrado",
          })
        );
      }
      if (supplierCreated.error.meta.target.includes("email")) {
        response.status(400).send(
          JSON.stringify({
            error: "email já existe",
          })
        );
      }
      if (supplierCreated.error.meta.target.includes("phone")) {
        response.status(400).send(
          JSON.stringify({
            error: "phone já existe",
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
        id: z.string().regex(RegExp("[0-9][0-9]*")),
        name: z.string().trim().min(3).max(51),
        email: z.string().email(),
        phone: z.string().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { id, name, email, phone } = supplierValidation.parse(request.body);
      const supplier = {
        id: Number(id),
        name: name,
        email: email,
        phone: phone,
      };
      const supplierExists = await Supplier.validatedSupplierExists(supplier);
      if (supplierExists.status) {
        if (!supplierExists.exists) {
          response.status(404).send(
            JSON.stringify({
              error: supplierExists.message,
            })
          );
        }

        const supplierValidated = await Supplier.validatedSupplierData(
          supplier
        );

        if (supplierValidated.status) {
          if (supplierValidated.isValid) {
            const supplierUpdated = await Supplier.updateSupplier(supplier);
            if (supplierUpdated.supplier != null) {
              response.status(200).send(
                JSON.stringify({
                  supplier: supplierUpdated.supplier,
                })
              );
            }
            response.status(500).send(
              JSON.stringify({
                supplier: supplierUpdated.error,
              })
            );
          }
          response.status(400).send(
            JSON.stringify({
              error: supplierValidated.message,
            })
          );
        }
        response.status(500).send(
          JSON.stringify({
            error: supplierValidated.error,
          })
        );
      }
      response.status(500).send(
        JSON.stringify({
          error: supplierExists.error,
        })
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
        //        id: z.string().trim().min(36).max(36),
        id: z.string(),
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
