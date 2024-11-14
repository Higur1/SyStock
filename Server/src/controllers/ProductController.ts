import ProductService from "../service/ProductService";
import IProduct from "../interface/IProduct";
import Decimal from "decimal.js";
import z from "zod";
import { convertStringToNumber } from "../functions/baseFunctions";
export default class ProductController {
    static async findAll(request, response) {
        try {
            const listResult = await ProductService.findAll();

            response.status(200).send(JSON.stringify({
                Products: listResult.products
            }));
        } catch (error) {
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
    static async create(request, response) {
        try {
            const productValidation = z.object({
                name: z.string().trim().min(2).max(20),
                price: z.number().positive(),
                costPrice: z.number().positive(),
                minimunQuantity: z.number().positive(),
                observation: z.string().max(30).optional(),
                category_id: z.number().positive().optional()
              });
              const { name, price, costPrice, minimunQuantity, observation, category_id } =
                productValidation.parse(request.body);
        
              const productData: IProduct = {
                name,
                excludedStatus: false,
                price: new Decimal(price),
                costPrice: new Decimal(costPrice),
                minimunQuantity,
                observation,
                totalQuantityInStock: 0,
                category_id: category_id ?? 1
              };

              const createdResult = await ProductService.create(productData);

              response.status(201).send(JSON.stringify({
                Product: createdResult.product
              }));
        } catch (error) {
            if (error.message === "Name already exists") {
                return response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Category doesn't found") {
                return response.status(404).send(JSON.stringify({
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
    static async find(request, response) {
        try {
            const product_id = z.object({
                id: z.string().min(1),
              });
        
              const { id } = product_id.parse(request.params);
        
              const productData: IProduct = {
                id: Number(id),
                category_id: 0,
                costPrice: new Decimal(0),
                name: "",
                price: new Decimal(0),
                minimunQuantity: 0,
                totalQuantityInStock: 0,
                excludedStatus: false,
              };

              const findResult = await ProductService.find(productData);

              response.status(200).send(JSON.stringify({
                Product: findResult.product
              }));
        } catch (error) {
            if (error.message === "Product not found") {
                return response.status(404).send(JSON.stringify({
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
    static async findByCategory(request, response) {
        try {
            const category = z.object({
                category_id: z.string().trim()
              });
        
              const { category_id } = category.parse(request.params);
        
              const productData: IProduct = {
                category_id: Number(category_id),
                costPrice: new Decimal(0),
                name: "",
                price: new Decimal(0),
                minimunQuantity: 0,
                totalQuantityInStock: 0,
                excludedStatus: false,
              };

              const findResult = await ProductService.findByCategory(productData);

              response.status(200).send(JSON.stringify({
                Product: findResult.products
              }));
        } catch (error) {
            if (error.message === "Category not found") {
                return response.status(500).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                return response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            }
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        };
    };
    static async findByName(request, response){
        try {
            const product_id = z.object({
                name: z.string().min(1),
              });
        
              const { name } = product_id.parse(request.params);
        
              const productData: IProduct = {
                category_id: 0,
                costPrice: new Decimal(0),
                name: name,
                price: new Decimal(0),
                minimunQuantity: 0,
                totalQuantityInStock: 0,
                excludedStatus: false,
              };

              const findResult = await ProductService.findByName(productData);

              response.status(200).send(JSON.stringify({
                Product: findResult.product
              }));
        } catch (error) {
            if (error.message === "Product not found") {
                return response.status(404).send(JSON.stringify({
                    Message: error.message
                }))
            }
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
    static async update(request, response) {
        try {
            const productValidation = z.object({
                id: z.number().positive(),
                name: z.string().trim().min(3).max(20),
                price: z.number().positive(),
                costPrice: z.number().positive(),
                minimunQuantity: z.number().positive(),
                observation: z.string().trim().max(30),
                category_id: z.number().positive(),
              });
        
              const { id, name, price, costPrice, minimunQuantity, observation, category_id } = productValidation.parse(request.body);
        
              const productData: IProduct = {
                id: id,
                name: name,
                price: new Decimal(price),
                costPrice: new Decimal(costPrice),
                minimunQuantity: minimunQuantity,
                observation: observation,
                category_id: category_id,
                excludedStatus: false,
              };

              const updatedResult = await ProductService.update(productData);

              response.status(200).send(JSON.stringify({
                Message: "Product updated successfully",
                Product: updatedResult.product
              }));
        } catch (error) {
            if (error.message === "Category not found") {
                return response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Could not update product, name already exists") {
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
            const product_id = z.object({
                id: z.string().trim().min(1),
              });
              const { id } = product_id.parse(request.params);
        
              const convertStringToNum = convertStringToNumber(id);

              const productData: IProduct = {
                id: convertStringToNum,
                category_id: 0,
                costPrice: new Decimal(0),
                name: "",
                price: new Decimal(0),
                minimunQuantity: 0,
              };

              await ProductService.delete(productData);

              response.status(200).send(JSON.stringify({
                Message: "Product deleted successfully",
              }));
        } catch (error) {
            if (error.message === "Product has batchs with products") {
                return response.status(400).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Product not found") {
                return response.status(404).send(JSON.stringify({
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
    static async listExpired(request, response){
        try {
            const listResult = await ProductService.expired();

            response.status(200).send(JSON.stringify({
                Products: listResult.list
            }));
        } catch (error) {
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
    static async listZeroStock(request, response){
        try {
            const listResult = await ProductService.zeroStock();

            response.status(200).send(JSON.stringify({
                Products: listResult.list
            }));
        } catch (error) {
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
    static async listLowQuantity(request, response){
        try {
            const listResult = await ProductService.lowQuantity();

            response.status(200).send(JSON.stringify({
                Products: listResult.list
            }));
        } catch (error) {
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
    static async listCloseToExpiration(request, response){
        try {
            const listResult = await ProductService.closeToExpiration();

            response.status(200).send(JSON.stringify({
                Products: listResult.list
            }));
        } catch (error) {
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
};