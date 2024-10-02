import { prisma } from "../config/prisma";

export default class Product {
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
    }
  }
  static async create(productObject) {
    try {
      let product_template = { name: "", id: 0 };

      const verifyProductExists = await Product.verifyDuplicateName(
        productObject.name
      );
      if (!verifyProductExists.exists) {
        const productResult = await prisma.product.create({
          data: {
            name: productObject.name,
            price: productObject.price,
            costPrice: productObject.costPrice,
            minimunQuantity: productObject.minimunQuantity,
            observation: productObject.observation,
            totalQuantityInStock: 0,
            category_id: productObject.category_id,
            excludedStatus: false,
          },
          select:{
            id: true,
            name: true,
            price: true,
            costPrice: true,
            minimunQuantity: true,
            observation: true,
            totalQuantityInStock: true,
            category_id: true
          },
        });
        product_template.id = productResult.id;
        product_template.name = productResult.name;
        return productResult != null
          ? { status: true, product: productResult }
          : { status: true, product: undefined };
      } else {
        const product = await prisma.product.findFirst({
          where: {
            name: productObject.name,
            category_id: productObject.category_id,
          },
        });

        return product != null
          ? { status: true, productAlredyExists: true }
          : { status: true, product: undefined };
      }
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findById(product_id) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: product_id,
          excludedStatus: false,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: null };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByCategory(category_id) {
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
        ? { status: true, products: productsByCategory }
        : { status: true, products: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(productObject) {
    try {
      const product = await prisma.product.update({
        data: {
          name: productObject.name,
          price: productObject.price,
          costPrice: productObject.costPrice,
          minimunQuantity: productObject.minimunQuantity,
          observation: productObject.observation,
          category_id: productObject.category_id,
        },
        where: {
          id: productObject.id,
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
  static async delete(product_id) {
    try {
      await prisma.batch.deleteMany({
        where: {
          product_id: product_id,
        },
      });
      // substitui o delete por atualização no status de exclusão.
      await prisma.product.update({
        where: {
          id: product_id,
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
  static async verifyDuplicateName(name) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          AND: {
            name: name,
            excludedStatus: false,
          },
        },
      });
      return product != null
        ? { status: true, exists: true, product: product }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
