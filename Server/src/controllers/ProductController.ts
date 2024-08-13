import Product from "../models/Product";
import { z } from "zod";

export default class ProductController {
  static async findAll(request, response) {
    try {
      const products = await Product.findAll();

      if (products.status) {
        response.status(200).send(
          JSON.stringify({
            products: products.products
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: products.error,
          })
        );
      };
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error,
        })
      );
    };
  };
  static async create(request, response) {
    try {
      const productValidation = z.object({
        name: z.string().trim().min(3).max(20),
        category: z.number().positive().optional(),
        price: z.number().positive(),
        supplier: z.string().trim().min(36).max(36).optional(),
        quantity: z.number().positive(),
      });
      const { name, category, price, quantity, supplier } =
        productValidation.parse(request.body);

      const product = {
        name,
        category,
        price,
        quantity,
        supplier,
      };
      const productCreated = await Product.create(product);

      if (productCreated.status) {
        response.status(201).send(
          JSON.stringify({
            name: productCreated.product_name,
            batch: productCreated.batch_product
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: productCreated.error,
          })
        );
      };
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
  static async findById(request, response) {
    try {
      const product_id = z.object({
        id: z.string().trim().min(1),
      });
      const { id } = product_id.parse(request.params);
      const product = await Product.findById(Number(id));

      if (product.status) {
        response.status(200).send(
          JSON.stringify({
            product: product.product,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: product.error,
          })
        );
      };
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
  static async findByCategory(request, response){
    try {
      const category = z.object({
        category_id: z.string().trim()
      });

      const { category_id } = category.parse(request.params);

      const listProductsByCategory = await Product.findByCategory(Number(category_id));

      if(listProductsByCategory.status){
        response.status(200).send(
          JSON.stringify({
            products: listProductsByCategory.products
          })
        );
      }else{
        response.status(500).send(
          JSON.stringify({
            error: listProductsByCategory.error,
          })
        );
      };

    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    };
  };
  static async update(request, response) {
    try {
      const productValidation = z.object({
        id: z.number().positive(),
        name: z.string().trim().min(3).max(20),
        category_id: z.number().positive().optional(),
        price: z.number().positive(),
      });

      const { id, name, price, category_id} = productValidation.parse(request.body);

      const product = {
        id,
        name,
        price,
        category_id
      }

      const verifyDuplicateName = await Product.verifyDuplicateName(name);
   
      if(!verifyDuplicateName.exists || verifyDuplicateName.product?.id == product.id){
        const productUpdated = await Product.update(product);

        if(productUpdated.status){
          response.status(200).send(
            JSON.stringify({
              product: productUpdated.product
            })
          );
        }else{
          response.status(500).send(
            JSON.stringify({
              error: productUpdated.error,
            })
          );
        }
      }else{
        response.status(409).send(
          JSON.stringify({
            message: "could not update product, name already exists"
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  };
  static async delete(request, response) {
    try {
      const product_id = z.object({
        id: z.number().positive(),
      });
      const { id } = product_id.parse(request.body);
      const productDeleted = await Product.delete(id);

      if (productDeleted.status) {
        response.status(200);
      } else {
        response.status(500).send(
          JSON.stringify({
            error: productDeleted.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  };
}
