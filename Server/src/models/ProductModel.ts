import { prisma } from "../config/prisma";
import IProduct from "../interface/IProduct";
import IBatch from "../interface/IBatch";
import batch from "./BatchModel";
import User from "../interface/IUser";

export default class ProductService {
  static async findAll() {
    try {
      const products = await prisma.$queryRaw`
        SELECT
          id,
          name,
          price,
          costPrice,
          minimunQuantity,
          observation,
          totalQuantityInStock,
          CASE 
            WHEN category_id IS NULL THEN 'Generic'
            ELSE category_id
          END AS category_id
          FROM product
          WHERE excludedStatus = false
      ` 
      return products != null
        ? { status: true, products: products }
        : { status: false, products: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async getExcludedStatus(productData: IProduct) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productData.id,
        },
        select: {
          excludedStatus: true,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: null };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(productData: IProduct) {
    try {
        const productResult = await prisma.product.create({
          data: {
            name: productData.name,
            price: productData.price,
            costPrice: productData.costPrice,
            minimunQuantity: productData.minimunQuantity,
            observation: productData.observation ?? "",
            totalQuantityInStock: 0,
            category_id: productData.category_id,
            excludedStatus: false,
          },
          select: {
            id: true,
            name: true,
            price: true,
            costPrice: true,
            minimunQuantity: true,
            observation: true,
            totalQuantityInStock: true,
            category_id: true,
          },
        });
        const batchData: IBatch = {
          expirantionDate: new Date("2024-01-01T00:00:01.000"),
          product_id: productResult.id,
          quantity: 0,
          batchs_fills: [],
        };
        //await batch.create(batchData);

        return productResult != null
          ? { status: true, product: productResult }
          : { status: true, product: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async find(productData: IProduct) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productData.id,
          excludedStatus: false,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByCategory(category_id: number, id?: any) {
    try {
      const productsByCategory = await prisma.product.findMany({
        where: {
          AND: {
            category_id: category_id,
            excludedStatus: false,
          },
        },
        select: {
          id: true,
          name: true,
          category_id: true,
          Batch: {
            select: {
              quantity: true,
            },
          },
          price: true,
        },
      });
      return productsByCategory != null
        ? { status: true, exists: true, products: productsByCategory }
        : { status: true, exists: false, products: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByName(productData: IProduct) {
    try {
      const productResult = await prisma.product.findFirst({
        where: {
          name: productData.name,
          excludedStatus: false,
        },
      });
      return productResult != null
        ? { status: true, exists: true, product: productResult }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(productData: IProduct) {
    try {
      const product = await prisma.product.update({
        data: {
          name: productData.name,
          price: productData.price,
          costPrice: productData.costPrice,
          minimunQuantity: productData.minimunQuantity,
          observation: productData.observation,
          category_id: productData.category_id,
        },
        where: {
          id: productData.id,
          excludedStatus: false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          costPrice: true,
          minimunQuantity: true,
          observation: true,
          category_id: true,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(productData: IProduct) {
    try {
      const productBatch = await prisma.batch.findFirst({
        where: {
          product_id: productData.id,
        },
        select: {
          id: true,
          quantity: true,
        },
      });

      if (
        productBatch?.quantity == undefined ? 0 : productBatch?.quantity > 0
      ) {
        return {
          status: false
        };
      }

      await prisma.product.update({
        where: {
          id: productData.id,
        },
        data: {
          excludedStatus: true,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async deleteAll() {
    try {
      await prisma.product.updateMany({
        data: {
          excludedStatus: true,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
