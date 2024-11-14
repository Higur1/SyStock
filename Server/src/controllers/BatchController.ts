import IBatch from "../interface/IBatch";
import BatchService from "../service/BatchService";
import z from "zod"
import {dateBase} from "../functions/baseFunctions";

export default class BatchController {
    static async findAll(request, response) {
        try {
            const list = await BatchService.findAll();

            response.status(200).send(JSON.stringify({
                Batchs: list.batchs
            }))
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
    static async find(request, response) {
        try {
            const batchValidation = z.object({
                id: z.string().min(1)
            });
            const { id } = batchValidation.parse(request.params);

            const batchData: IBatch = {
                id: Number(id),
                expirantionDate: new Date(),
                product_id: 0,
                quantity: 0,
            }
            const findResult = await BatchService.find(batchData);

            response.status(200).send(JSON.stringify({
                Batch: findResult.batch
            }));
        } catch (error) {
            if (error.message === "Batch not found") {
                response.status(404).send(JSON.stringify({
                    Error: error.message
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
    static async findByProduct(request, response) {
        try {
            const batchValidation = z.object({
                product_id: z.number().positive()
            });
            const { product_id } = batchValidation.parse(request.body);
            debugger;
            const batchData: IBatch = {
                expirantionDate: new Date(),
                product_id: product_id,
                quantity: 0
            }
            const findResult = await BatchService.findByProduct(batchData);
            response.status(200).send(JSON.stringify({
                Batchs: findResult.batchs
            }));
        } catch (error) {
            if (error.message === "Product not found") {
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
    static async create(request, response){
        try {
            const batchValidation = z.object({
                expirationDate: z.date(),
                product_id: z.number().positive(),
                quantity: z.number().positive()
            });

            const {expirationDate, product_id, quantity} = batchValidation.parse(request.body);

            const batchData: IBatch = {
                expirantionDate: expirationDate,
                product_id: product_id,
                quantity: quantity,
                deletationStatus: false,
                eValidationStatus: 2
            };

            const createResult = await BatchService.create(batchData);

            response.status(201).send(JSON.stringify({
                Batch: createResult.batch
            }));
        } catch (error) {
            if(error.message == "Batch with expiration date already exists"){
                return response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                return response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
         };
    };
    static async delete(request, response) {
        try {
            const batchValidation = z.object({
                id: z.number().positive()
            });

            const { id } = batchValidation.parse(request.body);

            const batchData: IBatch = {
                expirantionDate: new Date(),
                product_id: 0,
                quantity: 0,
                id: id
            }

            await BatchService.delete(batchData);

            response.status(200).send(JSON.stringify({
                Message: "Batch deleted successfully"
            }))
        } catch (error) {
            if (error.message === "it is not possible to delete a batch with products") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Batch not found") {
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
    static async addQuantity(request, response) {
        try {
            const batchValidation = z.object({
                product_id: z.number(),
                expirationDate: z.string().transform((val) => new Date(val)),
                quantity: z.number()
            });
            const { product_id, expirationDate, quantity } = batchValidation.parse(request.body);

            const batchData: IBatch = {
                product_id: product_id,
                expirantionDate: expirationDate ? expirationDate: dateBase(),
                quantity: quantity
            };

            await BatchService.addQuantity(batchData);

            response.status(200).send(JSON.stringify({
                Message: "Amount added"
            }));
        } catch (error) {
            if (error.message === "Batch not found") {
                return response.status(404).send(JSON.stringify({
                    Error: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                return response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
    static async subQuantity(request, response) {
        try {
            const batchValidation = z.object({
                product_id: z.number(),
                expirationDate: z.string().transform((val) => new Date(val)),
                quantity: z.number()
            });
            const { product_id, expirationDate, quantity } = batchValidation.parse(request.body);

            const batchData: IBatch = {
                product_id: product_id,
                expirantionDate: expirationDate ? expirationDate: dateBase(),
                quantity: quantity
            };

            await BatchService.subQuantity(batchData);

            response.status(200).send(JSON.stringify({
                Message: "Amount subtracted"
            }));
        } catch (error) {
            if(error.message === "Batch not found"){
                return response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if(error.message === "Insufficient stock to withdraw quantity"){
                return response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                return response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        };
    };
};