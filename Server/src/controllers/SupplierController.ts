import SupplierService from "../service/SupplierService";
import ISupplier from "../interface/ISupplier";
import z from "zod";

export default class SupplierController {
    static async findAll(request, response) {
        try {
            const list = await SupplierService.findAll();

            response.status(200).send(JSON.stringify({
                Suppliers: list,
            }));
        } catch (error) {
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
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
            const supplierData: ISupplier = {
                name: name,
                email: email,
                phone: phone,
                excludedStatus: false
            };

            const createResult = await SupplierService.create(supplierData);

            response.status(201).send(JSON.stringify({
                Supplier: createResult
            }));
        } catch (error) {
            if (error.message === "Name already exists") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            }
            if (error.message === "Email already exists") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            }
            if (error.message === "Phone already exists") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            }
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
    static async find(request, response) {
        try {
            const supplierValidation = z.object({
                id: z.string().trim(),
            });
            const { id } = supplierValidation.parse(request.params);
            const supplierData: ISupplier = {
                email: "",
                name: "",
                phone: "",
                id: Number(id)
            };

            const findResult = await SupplierService.find(supplierData);

            response.status(200).send(JSON.stringify({
                Supplider: findResult.supplier
            }));
        } catch (error) {
            if (error.message === "Supplier not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            }
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
    static async findByName(request, response) {
        try {
            const supplierValidation = z.object({
                name: z.string().trim(),
            });
            const { name } = supplierValidation.parse(request.params);
            const supplierData: ISupplier = {
                email: "",
                name: name,
                phone: "",
            };

            const findResult = await SupplierService.find(supplierData);

            response.status(200).send(JSON.stringify({
                Supplider: findResult.supplier
            }));
        } catch (error) {
            if (error.message === "Supplier not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            }
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
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

            const supplierData: ISupplier = {
                id: id,
                name: name,
                email: email,
                phone: phone,
            };

            const updatedResult = await SupplierService.update(supplierData);

            response.status(200).send(JSON.stringify({
                Message: "Supplider updated Successfully",
                Supplier: updatedResult.supplier
            }))
        } catch (error) {
            if (error.message === "Supplier not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
    static async delete(request, response) {
        try {
            const supplierValidation = z.object({
                id: z.number(),
              });
              const { id } = supplierValidation.parse(request.body);
        
              const supplierData: ISupplier = {
                id: id,
                email: "",
                name: "",
                phone: ""
              };

              await SupplierService.delete(supplierData);
              response.status(200).send(JSON.stringify({
                Message: "Supplider deleted successfully"
              }))
        } catch (error) {
            if (error.message === "Supplier not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
}