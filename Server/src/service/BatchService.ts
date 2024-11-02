import IBatch from "../interface/IBatch";
import BatchModel from "../models/BatchModel";
import IProduct from "../interface/IProduct";
import ProductModel from "../models/ProductModel";
import Decimal from "decimal.js";

export default class BatchService{
    static async findAll(){
        try {
            const list = await BatchModel.findAll();

            return list;
        } catch (error) {
            throw error;
        }
    }
    static async create(batchData: IBatch){
        try {
            const find = await BatchModel.findByExpirationDate(batchData);
            if(find.batch != undefined){
                throw new Error("Batch with expiration date already exists")
            };
            const productData: IProduct = {
                category_id: 0,
                costPrice: new Decimal(0),
                minimunQuantity: 0,
                name: "",
                price: new Decimal(0),
                id: batchData.product_id
            }
            const findProduct = await ProductModel.find(productData);
            if(findProduct.product == undefined){
                throw new Error("Product not found");
            };

            const createdResult = await BatchModel.create(batchData);

            return createdResult;
        } catch (error) {
            throw error;
        }
    }
    static async find(batchData: IBatch){
        try {
            const findResult = await BatchModel.find(batchData);

            if(findResult.batch == undefined){
                throw new Error("Batch not found")
            }

            return findResult;
        } catch (error) {
            throw error;
        }
    }
    static async findByProduct(batchData: IBatch){
        try {
            const productData: IProduct = {
                category_id: 0,
                costPrice: new Decimal(0),
                minimunQuantity: 0,
                name: "",
                price: new Decimal(0),
                id: batchData.product_id
            }
            const findProduct = await ProductModel.find(productData);
            if(findProduct.product == undefined){
                throw new Error("Product not found")
            }
            const findResult = await BatchModel.findByProduct(batchData);

            return findResult;
        } catch (error) {
            throw error;
        }
    }
    static async update(batchData: IBatch, operation: number){
        try {
            const find = await BatchModel.find(batchData);
            if(find.batch == undefined){
                throw new Error("Batch not found");
            }
            if(operation == 2){
                if(find.batch.quantity < batchData.quantity){
                    throw new Error("Insufficient stock to withdraw quantity")
                }
                const supplyResult = await BatchModel.subQuantity(batchData);
                if(supplyResult.batch?.quantity == 0){
                    await BatchModel.setDateTheBatchWasCleared(batchData)
                }
                return supplyResult;
            }else{
                const supplyResult = await BatchModel.addQuantity(batchData);
                return supplyResult;
            }
        } catch (error) {
            throw error;
        }
    }
    static async delete(batchData: IBatch){
        try {
            const find = await BatchModel.find(batchData);
            const actuallyDate = new Date();
            const futureDate = new Date(actuallyDate);

            futureDate.setDate(actuallyDate.getDate() + 7);

            if(find.batch == undefined){
                throw new Error("Batch not found");
            };

            if(find.batch.expirationDate <= futureDate){
                throw new Error("It is not possible to delete a batch that has an expiration date")
            }

            const deletedResult = await BatchModel.delete(batchData);

            return deletedResult;
        } catch (error) {
            throw error;
        }
    }
}