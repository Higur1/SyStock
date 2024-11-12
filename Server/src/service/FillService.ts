import Decimal from "decimal.js";
import IFill from "../interface/IFill";
import ISupplier from "../interface/ISupplier";
import FillModel from "../models/FillModel";
import BatchModel from "../models/BatchModel";
import SupplierModel from "../models/SupplierModel";
import IProduct from "../interface/IProduct";
import IBatch from "../interface/IBatch";
import BatchFillModel from "../models/BatchFillModel";
import IBatch_Fill from "../interface/IBatchFill";
import ProductModel from "../models/ProductModel";
import BatchFill from "../models/BatchFillModel";

export default class FillService {
  static async create(fill: IFill) {
    try {

      const createdFill = await FillModel.create(fill);

      return createdFill;
    } catch (error) {
      throw error;
    }
  }
  static async findAll() {
    try {
      const fills = await FillModel.findAll();

      return fills;
    } catch (error) {
      throw error;
    };
  };
  static async findById(fill: IFill) {
    try {
      if(fill.id != undefined){
        const findFill = await BatchFillModel.findById(fill.id);

        if (!findFill) {
          throw new Error("Fill not found");
        };
  
        return findFill;
      }
    } catch (error) {
      throw error;
    }
  }
  static async findBySupplierId(supplier: ISupplier) {
    try {
      const findSupplier = await SupplierModel.find(supplier);

      if (findSupplier.supplier == undefined) {
        throw new Error("Supplier not found");
      };
      const fillData: IFill = {
        totalPrice: new Decimal(100),
        supplier_id: findSupplier.supplier.id,
        user_id: 0
      }

      const findFill = await FillModel.findBySupplierId(fillData);

      return findFill;
    } catch (error) {
      throw error;
    }
  }
  static async relationBatchFill(batch_Fill: IBatch_Fill, batch: IBatch, product: IProduct) {
    try {
      const findBatch = await BatchModel.findByExpirationDate(batch);
      if (findBatch.batch) {
        batch.id = findBatch.batch.id
        
        await BatchModel.addQuantity(batch);
        batch_Fill.batch_id = findBatch.batch.id
        await ProductModel.updatePrice(product);
        await ProductModel.updatedAddQuantityInStock(batch.product_id, batch.quantity)
        await BatchFillModel.create(batch_Fill);
        return { message: "Batch already exists, updated and batch_fill created." }
      }
      const createBatch = await BatchModel.create(batch);
      await ProductModel.updatePrice(product);
      await ProductModel.updatedAddQuantityInStock(batch.product_id, batch.quantity)
      batch_Fill.batch_id = createBatch.batch!.id;
      await BatchFillModel.create(batch_Fill);
      return { message: 'New batch created and batch_fill created.' }
    } catch (error) {
      throw error;
    }
  }
}