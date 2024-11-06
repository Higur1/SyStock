import IBatch from "../interface/IBatch";
import BatchModel from "../models/BatchModel";
import IProduct from "../interface/IProduct";
import ProductModel from "../models/ProductModel";
import Decimal from "decimal.js";

export default class BatchService {
    static async findAll() {
        try {
            const list = await BatchModel.findAll();

            return list;
        } catch (error) {
            throw error;
        };
    };
    static async create(batchData: IBatch) {
        try {
            const find = await BatchModel.findByExpirationDate(batchData);
            if (find.batch != undefined) {
                throw new Error("Batch with expiration date already exists")
            };
            const productData: IProduct = {
                category_id: 0,
                costPrice: new Decimal(0),
                minimunQuantity: 0,
                name: "",
                price: new Decimal(0),
                id: batchData.product_id
            };

            const findProduct = await ProductModel.find(productData);

            if (findProduct.product == undefined) {
                throw new Error("Product not found");
            };

            const createdResult = await BatchModel.create(batchData);

            return createdResult;
        } catch (error) {
            throw error;
        };
    };
    static async find(batchData: IBatch) {
        try {
            const findResult = await BatchModel.find(batchData);

            if (findResult.batch == undefined) {
                throw new Error("Batch not found");
            }

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async findByProduct(batchData: IBatch) {
        try {
            const productData: IProduct = {
                category_id: 0,
                costPrice: new Decimal(0),
                minimunQuantity: 0,
                name: "",
                price: new Decimal(0),
                id: batchData.product_id
            };

            const findProduct = await ProductModel.find(productData);

            if (findProduct.product == undefined) {
                throw new Error("Product not found")
            };
            const findResult = await BatchModel.findByProduct(batchData);

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async addQuantity(batchData: IBatch) {
        try {
            const find = await BatchModel.find(batchData);
            if (find.batch == undefined) {
                throw new Error("Batch not found");
            };
            const supplyResult = await BatchModel.addQuantity(batchData);
            return supplyResult;

        } catch (error) {
            throw error;
        };
    };
    static async subQuantity(batchData: IBatch) {
        try {
            const findByProduct = await BatchModel.findByProduct(batchData);

            const find = await BatchModel.find(batchData);
            if (find.batch == undefined) {
                throw new Error("Batch not found");
            };

            if(findByProduct.batchs != undefined && findByProduct.batchs.length > 1){
                batchData.id = findByProduct.batchs[2].id;

                const subResult = await BatchModel.subQuantityDesc(batchData);

                if (subResult.batch?.quantity == 0) {
                    await BatchModel.setDateTheBatchWasCleared(batchData);
                };
    
                return subResult
            }   
           
            if (find.batch.quantity < batchData.quantity) {
                throw new Error("Insufficient stock to withdraw quantity");
            };

            const subResult = await BatchModel.subQuantityGeneric(batchData);

            if (subResult.batch?.quantity == 0) {
                await BatchModel.setDateTheBatchWasCleared(batchData);
            };

            return subResult
            
        } catch (error) {
            throw error;
        };
    };
    static async delete(batchData: IBatch) {
        try {
            const find = await BatchModel.find(batchData);

            if (find.batch == undefined) {
                throw new Error("Batch not found");
            };
            if (find.batch.quantity > 0) {
                throw new Error("it is not possible to delete a batch with products")
            };

            const deletedResult = await BatchModel.delete(batchData);

            return deletedResult;
        } catch (error) {
            throw error;
        };
    };
};