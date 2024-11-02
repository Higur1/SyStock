import IBatch from "../interface/IBatch";
import BatchService from "../models/BatchModel";
import z from "zod"
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
            const batchData: IBatch = {
                expirantionDate: new Date(),
                product_id: product_id,
                quantity: 0
            }
            const findResult = await BatchService.findByProduct(batchData);
            response.status(200).send(JSON.stringify({
                Batchs: findResult.batch
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
            if (error.message === "It is not possible to delete a batch that has an expiration date") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Batch not found") {
                response.status(500).send(JSON.stringify({
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
    static async supply(request, response) {
        try {
            const baseData = ("2024-01-01T03:00:01.000Z");
            const batchValidation = z.object({
                product_id: z.number(),
                expirationDate: z.string().transform((val) => new Date(val)).default(baseData),
                quantity: z.number(),
                operation: z.number()
            });
            const { product_id, expirationDate, quantity, operation } = batchValidation.parse(request.body);

            const batchData: IBatch = {
                product_id: product_id,
                expirantionDate: expirationDate,
                quantity: quantity
            }

            if(operation == 1){
                await BatchService.addQuantity(batchData);
            }else{
                await BatchService.subQuantity(batchData);
            }
            response.status(200).send(JSON.stringify({
                Message: "Operation successfully"
            }))
        } catch (error) {
            if (error.message === "Batch not found") {
                response.status(404).send(JSON.stringify({
                    Error: error.message
                }));
            };
            if (error.message === "Insufficient stock to withdraw quantity") {
                response.status(400).send(JSON.stringify({
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
}