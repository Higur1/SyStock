import IProduct from "../interface/IProduct";
import ProducModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import ICategory from "../interface/ICategory";
import IBatch from "../interface/IBatch";
import BatchModel from "../models/BatchModel";
import { dateBase } from "../functions/baseFunctions";

export default class ProducService {
  static async findAll() {
    try {
      const list = await ProducModel.findAll();

      return list;
    } catch (error) {
      throw error;
    }
  }
  static async create(productData: IProduct) {
    try {
      let category_id_replace = 0;
      let errorTratado:string="";
      if (productData.category_id != 0) {
        category_id_replace = productData.category_id;
      }
      const categoryData: ICategory = {
        id: category_id_replace,
        name: "",
      };
      const findCategory = await CategoryModel.find(categoryData);

      if (findCategory.category == undefined) {
        //throw new Error("Category doesn't found");
        errorTratado="Category doesn't found"
      }

      const verifyNameDuplicate = await ProducModel.findByName(productData);

      if (verifyNameDuplicate.exists) {
        throw new Error("Name already exists");
      }
      const createResult = await ProducModel.create(productData);
      const batchData: IBatch = {
        expirantionDate: undefined,
        product_id: createResult.product!.id,
        quantity: 0,
        deletationStatus: false,
        eValidationStatus: 2,
      };

      const returBatch = await BatchModel.create(batchData);
      return errorTratado == "" ?
      {createResult} :  {errorTratado}
    } catch (error) {
      throw error;
    }
  }
  static async find(productData: IProduct) {
    try {
      const findResult = await ProducModel.find(productData);

      if (findResult.product == undefined) {
        throw new Error("Product not found");
      }
      return findResult;
    } catch (error) {
      throw error;
    }
  }
  static async findByCategory(productData: IProduct) {
    try {
      const categoryData: ICategory = {
        name: "",
        id: productData.category_id,
      };
      const findCategory = await CategoryModel.find(categoryData);
      if (!findCategory.exists) {
        throw new Error("Category doesn't found");
      }

      const findResult = await ProducModel.findByCategory(
        productData.category_id
      );

      return findResult;
    } catch (error) {
      throw error;
    }
  }
  static async findByName(productData: IProduct) {
    try {
      const findResult = await ProducModel.findByName(productData);

      if (!findResult.exists) {
        throw new Error("Product not found");
      }

      return findResult;
    } catch (error) {
      throw error;
    }
  }
  static async update(productData: IProduct) {
    try {
      const categoryData: ICategory = {
        name: "",
        id: productData.category_id,
      };
      const verifyCategoryExists = await CategoryModel.find(categoryData);
      if (!verifyCategoryExists.exists) {
        throw new Error("Category not found");
      }
      const verifyDuplicateName = await ProducModel.findByName(productData);

      if (verifyDuplicateName.exists) {
        throw new Error("Could not update product, name already exists");
      }

      const updatedResult = await ProducModel.update(productData);

      return updatedResult;
    } catch (error) {
      throw error;
    }
  }
  static async delete(productData: IProduct) {
    try {
      const findBatch = await BatchModel.findByProduct(productData.id || 0);
      if (findBatch.exists && findBatch.batchs != undefined) {
        let quantidadeProduct: number = 0;
        findBatch.batchs?.forEach((element) => {
          quantidadeProduct = quantidadeProduct + element.quantity;
        });
        if (quantidadeProduct > 0) {
          throw new Error(
            "It is not possible to delete a product that has a quantity greater than zero "
          );
        }
        await BatchModel.deleteManyByProduct(findBatch.batchs[0].product_id);
        await ProducModel.delete(productData);
        return { message: "Product deleted sucessfully!" };
      }
      await ProducModel.delete(productData);
      return { message: "Product deleted sucessfully!" };
    } catch (error) {
      return error;
    }
  }
}
