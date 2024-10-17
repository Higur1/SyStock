import { z } from "zod";
import supplierService from "../service/SupplierService";
import Supplier from "../models/Supplier";

export default class SupplierController {
  static async findAll(request, response) {
    try {
      const suppliers = await supplierService.findAll();
      if (suppliers.status) {
        response.status(200).send(
          JSON.stringify({
            suppliers: suppliers.suppliers,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: suppliers.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error,
        })
      );
    }
  };
  static async create(request, response) {
    try {
      const supplierValidation = z.object({
        name: z.string().trim().min(3).max(51),
        email: z.string().email(),
        phone: z.string().trim().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { name, email, phone } = supplierValidation.parse(request.body);
      const supplierData = {
        name: name,
        email: email,
        phone: phone,
        excludedStatus: false
      };

      const supplierValidated = await supplierService.validatedSupplierData(supplierData);

      if (supplierValidated.status) {
        if (supplierValidated.isValid) {
          const supplierCreated = await supplierService.create(supplierData);
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
        response.status(200).send(
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
  };
  static async findById(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.string().trim(),
      });
      const { id } = supplierValidation.parse(request.params);
      const supplierData: Supplier = {
        email: "",
        phone: "",
        name: "",
        id: Number(id)
      };
      const supplierFound = await supplierService.findById(supplierData);

      if (supplierFound.status) {
        if (supplierFound.supplier != undefined) {
          response.status(200).send(
            JSON.stringify({
              supplier: supplierFound.supplier,
            })
          );
        }
        response.status(200).send(
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
  };
  static async findByName(request, response) {
    try {
      const supplierValidation = z.object({
        name: z.string().trim().min(3).max(51),
      });
      const { name } = supplierValidation.parse(request.params);
      const supplierData: Supplier = {
        email: "",
        phone: "",
        name: name,
      };
      const supplierFound = await supplierService.findByName(supplierData);

      if (supplierFound.status) {
        if (supplierFound.supplier != undefined) {
          response.status(200).send(
            JSON.stringify({
              supplier: supplierFound.supplier,
            })
          );
        }
        response.status(200).send(
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
  };
  static async update(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.number(),
        name: z.string().trim().min(3).max(51),
        email: z.string().email(),
        phone: z.string().length(11).regex(RegExp("[0-9]{11}")),
      });

      const { id, name, email, phone } = supplierValidation.parse(request.body);

      const supplierData = {
        id: id,
        name: name,
        email: email,
        phone: phone,
      };

      const supplierExists = await supplierService.validatedSupplierExists(supplierData);

      if (!supplierExists.status) {
        return response.status(200).send(JSON.stringify({
          message: "Supplier not found"
        }));
      };

      const supplierValidationInDataBase = await supplierService.validatedSupplierData(supplierData);

      if (supplierValidationInDataBase.isValid) {
        const supplierUpdated = await supplierService.update(supplierData);
        return response.status(200).send(JSON.stringify({
          supplier: supplierUpdated.supplier
        }));
      } else {
        return response.status(200).send(JSON.stringify({
          error: supplierValidationInDataBase.message
        }));
      };
    } catch (error) {
      response.status(400).send(JSON.stringify({
        error: error
      }));
    };
  };
  static async delete(request, response) {
    try {
      const supplierValidation = z.object({
        id: z.number(),
      });
      const { id } = supplierValidation.parse(request.body);

      const supplierData: Supplier = {
        id: id,
        email: "",
        name: "",
        phone: ""
      }

      const supplierDeleted = await supplierService.delete(supplierData);

      if (supplierDeleted.status) {
        response.status(200).send(JSON.stringify({}));
      }
      if (supplierDeleted.error.meta.cause.includes("not exist")) {
        response.status(200).send(
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
  };
};
