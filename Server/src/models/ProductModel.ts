import { prisma } from "../config/prisma";
import IProduct from "../interface/IProduct";
import IBatch from "../interface/IBatch";
import {dateBase} from "../functions/baseFunctions";

export default class ProductService {
  static async findAll() {
    try {
      const products = await prisma.product.findMany({
        where:{
          excludedStatus: false
        }
      });
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
            category_id: productData.category_id ?? 1,
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
          expirantionDate: dateBase(),
          product_id: productResult.id,
          quantity: 0,
          batchs_fills: [],
        };

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
  static async updatedAddQuantityInStock(product_id: number, quantity: number){
    try {
      await prisma.product.update({
        where:{
          id: product_id
        },
        data:{
          totalQuantityInStock: {
            increment: quantity
          }
        }
      })
      return {status: true}
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updatedSubQuantityInStock(product_id: number, quantity: number){
    try {
      await prisma.product.update({
        where:{
          id: product_id
        },
        data:{
          totalQuantityInStock: {
            decrement: quantity
          }
        }
      })
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
  static async updatePrice(productData: IProduct){
    try {
        const newPrice = await prisma.product.update({
          where:{
            id: productData.id
          },
          data:{
            price: productData.price,
            costPrice: productData.costPrice
          }
        })
        return {status: true, newPrice: newPrice}
    } catch (error) {
        return {status: false, error: error}
    }
  }
  static async zeroStock(){
    try {
      const list = await prisma.product.findMany({
        where: {
          AND: [
            {totalQuantityInStock: 0}, {excludedStatus: false}
          ]
          
        }
      })
      return list != undefined ? {status: true, exists: true, list:list} : {status: true, exists: false, list: {}}
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async lowQuantity(){
    try {
      const list = await prisma.$queryRaw`
        SELECT * FROM product
        WHERE totalQuantityInStock < minimunQuantity
        AND excludedStatus = false
      ` 
      return list != null ? {status: true, exists: true, list: list} : {status: true, exists: false, list: {}}
    } catch (error) {
      return { status: false, error: error };
    }
  }
}


