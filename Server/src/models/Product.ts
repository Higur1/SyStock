import { prisma } from "../config/prisma";

export default class Product {
  static async findAll(company_id) {
    try {
      const products = await prisma.product.findMany({
        where: {
          company_id: company_id,
        },
        select: {
          id: true,
          name: true,
          price: true,
          category_id: true,
          createAt: true,
        },
      });

      return products != null
        ? { status: true, products: products }
        : { status: false, products: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async create(productObject) {
    try {

      let supplier_id = productObject.supplier;
      let category_id = productObject.category;

      let product_template = {name: "", id: 0};

      if (productObject.supplier == undefined) {
        supplier_id = await Product.findGenericSupplier(
          productObject.company_id
        );
      };
      if (productObject.category == undefined){
        category_id = await Product.findGenericCategory(
          productObject.company_id
        )
      };

      const verifyProductExists = await Product.verifyDuplicateName(
        productObject.name,
        productObject.company_id
      );
      
      if(!verifyProductExists.exists){
        const product = await prisma.product.create({
          data:{
            name: productObject.name,
            price: productObject.price,
            category_id: category_id,
            company_id: productObject.company_id
          }
        });
        product_template.id = product.id;
        product_template.name = product.name;
      }else{
        const product = await prisma.product.findFirst({
          where:{
            name: productObject.name,
            category_id: category_id,
            company_id: productObject.company_id
          }
        });
        product_template.id = product!.id;
        product_template.name = product!.name;
      }
      const batch_product = await prisma.batch.create({
        data:{
          product_id: product_template.id,
          supplier_id: supplier_id,
          company_id: productObject.company_id,
          quantity: productObject.quantity
        },select:{
          id: true,
          product_id: true,
          supplier_id: true,
          createAt: true,
          quantity: true
        }
      });

      return batch_product != null ? {status: true, batch_product: batch_product, product_name: product_template.name} : {status: true, batch_product: undefined};
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findById(product_id) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: product_id,
        },
      });

      return product != null
        ? { status: true, product: product }
        : { status: true, product: null };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findByCategory(category_id, company_id){
    try {
      const productsByCategory = await prisma.product.findMany({
        where:{
          AND:{
            category_id: category_id,
            company_id: company_id  
          }
        },select:{
          id:true,
          name: true,
          category_id: true,
          Batch:{
            select:{
              quantity: true
            }
          },
          price: true
        }
      });

      return productsByCategory != null ? {status: true, products: productsByCategory} : {status: true, products: undefined};
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async update(productObject) {
    try {
      const product = await prisma.product.update({
        data:{
          name: productObject.name,
          category_id: productObject.category_id,
          price: productObject.price,
        },
        where:{
          id: productObject.id
        },
        select:{
          id: true,
          name: true,
          category_id: true,
          price: true
        }
      });

      return product != null ? {status: true, product: product} : {status: true, product: undefined};
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async delete(product_id) {
    try {
      await prisma.batch.deleteMany({
        where:{
          product_id: product_id
        }
      })
      await prisma.product.delete({
        where: {
          id: product_id,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findGenericSupplier(company_id) {
    try {
      const supplier = await prisma.supplier.findFirst({
        where: {
          AND: {
            name: "Generic",
            company_id: company_id,
          },
        },
        select: {
          id: true,
        },
      });
      return supplier!.id;
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findGenericCategory(company_id){
    try {
      const category = await prisma.category.findFirst({
        where:{
          AND:{
            name: "Generic",
            company_id: company_id
          }
        }
      })
      return category!.id;
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async verifyDuplicateName(name, company_id) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          AND: {
            name: name,
            company_id: company_id,
          },
        },
      });
      return product != null
        ? { status: true, exists: true, product: product }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async sumQuantitiyProducts(company_id) {
    try {
      const product = await prisma.batch.groupBy({
        by: ["product_id"],
        _sum:{
            quantity: true
        },
        
        where:{company_id: company_id}
      });
      return { status: true, list: product };
    } catch (error) {
      return { status: false, error: error };
    }
  };
}
