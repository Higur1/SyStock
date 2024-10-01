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

      const supplierValidated = await Supplier.validatedSupplierData(supplier);

      if (supplierValidated.status) {
        if (supplierValidated.isValid) {
          const supplierCreated = await Supplier.create(supplier);
          if (supplierCreated.supplier != null) {
            response.status(201).send(
              JSON.stringify({
                supplier: supplierCreated.supplier,
              })
            );
          }
          response.status(500).send(
            JSON.stringify({
              supplier: supplierCreated.error,
            })
          );
        }
        response.status(400).send(
          JSON.stringify({
            error: supplierValidated.message,
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
        id: z.string().trim(),
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
        }
        response.status(404).send(
          JSON.stringify({
            error: "supplier don't exists",
          })
        );
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
  static async findByName(request, response) {
    try {
      const supplierValidation = z.object({
        name: z.string().trim().min(3).max(51),
      });
      const { name } = supplierValidation.parse(request.params);

      const supplierFound = await Supplier.findByName(name);

      if (supplierFound.status) {
        if (supplierFound.supplier != undefined) {
          response.status(200).send(
            JSON.stringify({
              supplier: supplierFound.supplier,
            })
          );
        }
        response.status(404).send(
          JSON.stringify({
            error: "supplier don't exists",
          })
        );
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
        id: z.number(),
        name: z.string().trim().min(3).max(51),
        email: z.string().email(),
        phone: z.string().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { id, name, email, phone } = supplierValidation.parse(request.body);
      const supplier = {
        id: id,
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
        id: z.number(),
      });
      const { id } = supplierValidation.parse(request.body);

      const supplierDeleted = await Supplier.delete(id);

      if (supplierDeleted.status) {
        response.status(200).send(JSON.stringify({}));
      }
      if (supplierDeleted.error.meta.cause.includes("not exist")) {
        response.status(404).send(
          JSON.stringify({
            error: "supplier don't exists",
          })
        );
      }
      response.status(500).send(
        JSON.stringify({
          error: supplierDeleted.error,
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
}
