import { prisma } from "../config/prisma";
import Product from "../models/Product";

export default class ProductService {
  static async findAll() {
    try {
      const products = await prisma.product.findMany({
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
        where: {
          excludedStatus: false,
        },
      });

      return products != null
        ? { status: true, products: products }
        : { status: false, products: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async create(productData: Product) {
    try {
      const verifyProductExists = await ProductService.findByName(productData);

      if (!verifyProductExists.exists) {
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
            category_id: true
          },
        })
        return productResult != null
          ? { status: true, product: productResult }
          : { status: true, product: undefined };
      } else {
        return { status: true, message: "Product alredy exists" };
      };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findById(productData: Product) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productData.id,
          excludedStatus: false,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: null };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByCategory(productData: Product) {
    try {
      const productsByCategory = await prisma.product.findMany({
        where: {
          AND: {
            category_id: productData.category_id,
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
        ? { status: true, products: productsByCategory }
        : { status: true, products: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByName(productData: Product) {
    try {
      const productResult = await prisma.product.findFirst({
        where: {
          name: productData.name
        }
      });
      return productResult != null ? { status: true, exists: true, product: productResult } : { status: true, exists: false }
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async update(productData: Product) {
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
    };
  };
  static async delete(productData: Product) {
    try {
      await prisma.batch.deleteMany({
        where: {
          product_id: productData.id,
        },
      });
      // substitui o delete por atualização no status de exclusão.
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
    };
  };
  static async deleteAll() {
    try {
      await prisma.product.deleteMany();

      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
};
