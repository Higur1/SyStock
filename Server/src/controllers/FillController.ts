import z from "zod"
import IFill from "../interface/IFill";
import FillService from "../service/FillService";
import Decimal from "decimal.js";
import {convertStringToNumber, dateBase, getUserToken} from "../functions/baseFunctions";
import ISupplier from "../interface/ISupplier";
import IProduct from "../interface/IProduct";
import IBatch from "../interface/IBatch";
import IBatch_Fill from "../interface/IBatchFill";
import BatchFill from "../models/BatchFillModel";

export default class FillController {
    static async create(request, response){
        try {
            const batch_fill = z.object({
                quantity: z.number().positive(),
                expirationDate: z.string().transform((val) => new Date(val)).optional(),
                product_id: z.number().positive(),
                price: z.number().positive(),
                subTotal: z.number().positive(),
                costPrice: z.number().positive()
            })  
            const fillValidation = z.object({
                supplier_id: z.number().positive().optional(),
                totalPrice: z.number().positive(),
                batchs_fill: z.array(batch_fill),
                observation: z.string().optional()
            })

            const {totalPrice, batchs_fill, supplier_id, observation} = fillValidation.parse(request.body);

         
            const fillData: IFill = {
                totalPrice: new Decimal(totalPrice),
                supplier_id: supplier_id || 1,
                user_id: getUserToken(request).id,
                observation: observation || ""
            };

            const resultFill = await FillService.create(fillData);
            
            for(const element of batchs_fill){
                const productData: IProduct = {
                    category_id: 1,
                    costPrice: new Decimal(element.costPrice),
                    minimunQuantity: 0,
                    name: "",
                    price: new Decimal(element.price),
                }
                
                const batchData: IBatch = {
                    expirantionDate: element.expirationDate,
                    product_id: element.product_id, 
                    quantity: element.quantity
                }
                const batchFill: IBatch_Fill ={
                    costPrice: new Decimal(element.costPrice),
                    subtotal: new Decimal(element.subTotal),
                    quantity: element.quantity,
                    batch_id: batchData.id || 0,
                    fill_id: resultFill.fill!.id
                }
                await FillService.relationBatchFill(batchFill, batchData, productData);
            }
        
            response.status(201).send(JSON.stringify({
                Message: "Fill successfully"
            }));
        } catch (error) {
            if (error.message === "Internal Server Error") {
                return response.status(500).send(JSON.stringify({
                  Error: error.message
                }));
              };
              console.log(error)
              response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
              }));
        }
    }
    static async findAll(request, response) {
        try {
            const listOfFills = await FillService.findAll();

            response.status(200).send(JSON.stringify({
                Mesage: listOfFills.fills
              }));
        } catch (error) {
            if (error.message === "Fill not found") {
                return response.status(500).send(JSON.stringify({
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
        }
    }
    static async findById(request, response) {
        try {
            const fillValidation = z.object({
                id: z.string().trim().min(1)
            });

            const { id } = fillValidation.parse(request.params);
            const convertString = convertStringToNumber(id);
            const fillData: IFill = {
                supplier_id: 1,
                id: convertString,
                user_id: 1,
                totalPrice: new Decimal(0)
            };

            const findFill = await FillService.findById(fillData);
        
            response.status(200).send(JSON.stringify({
                Fill: findFill.fill
            }));
        } catch (error) {
            if (error.message === "Fill not found") {
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
        }
    }
    static async findBySupplierId(request, response) {
        try {
            const fillValidation = z.object({
                supplier_id: z.string().trim().min(1)
            });

            const {supplier_id} = fillValidation.parse(request.params);
            const converString = convertStringToNumber(supplier_id);

            const supplierData: ISupplier = {
                id: converString,
                email: "",
                name: "",
                phone: ""
            };

            const findFill = await FillService.findBySupplierId(supplierData);

            response.status(200).send(JSON.stringify({
                Fill: findFill.fill
            }));
        } catch (error) {
            if (error.message === "Supplier not found") {
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
        }
    }
};