import productService from "../service/ProductService";
import Product from "../models/Product";

import { number, z } from "zod";
import Decimal from "decimal.js";

export default class ProductController {
  static async findAll(request, response) {
    try {
      const products = await productService.findAll();

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
        name: z.string().trim().min(2).max(20),
        price: z.number().positive().refine((val) => val % 1 !==0),
        costPrice: z.number().positive().refine((val) => val % 1 !==0),
        minimunQuantity: z.number().positive(),
        observation: z.string().max(30).optional(),
        category_id: z.number().positive()
      });
      const { name, price, costPrice , minimunQuantity, observation, category_id} =
        productValidation.parse(request.body);

      const productData: Product = {
        name,
        excludedStatus: false,
        price: new Decimal(price),
        costPrice: new Decimal(costPrice),
        minimunQuantity,
        observation,
        totalQuantityInStock: 0,
        category_id
      };

      const productCreated = await productService.create(productData);

      if (productCreated.status) {
        if(productCreated.message){
          response.status(400).send(
            JSON.stringify({
                message: "Product alredy exists"
            })
          )
        }else{
          response.status(201).send(
            JSON.stringify({
              product: productCreated,
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: productCreated.error.issues,
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
        id: z.string().min(1),
      });
      const { id } = product_id.parse(request.params);
      const productData: Product = {
        id: Number(id),
        category_id: 0,
        costPrice: new Decimal(0),
        name: "",
        price: new Decimal(0),
        minimunQuantity: 0,
        totalQuantityInStock: 0,
        excludedStatus: false,
      }
      const productResult = await productService.findById(productData);

      if (productResult.status) {
        response.status(200).send(
          JSON.stringify({
            product: productResult.product,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: productResult.error,
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

      const productData: Product = {
        category_id: Number(category_id),
        costPrice: new Decimal(0),
        name: "",
        price: new Decimal(0),
        minimunQuantity: 0,
        totalQuantityInStock: 0,
        excludedStatus: false,
      }

      const listProductsByCategory = await productService.findByCategory(productData);

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
        price: z.number().positive(),
        costPrice: z.number().positive(),
        minimunQuantity: z.number().positive(),
        observation: z.string().trim().max(30),
        category_id: z.number().positive(),
      });

      const { id, name, price, costPrice, minimunQuantity, observation, category_id} = productValidation.parse(request.body);

      const productData: Product = {
        id: id,
        name: name,
        price: new Decimal(price),
        costPrice: new Decimal(costPrice),
        minimunQuantity: minimunQuantity,
        observation: observation,
        category_id: category_id,
        excludedStatus: false,
      }

      const verifyDuplicateName = await productService.findByName(productData);
   
      if(!verifyDuplicateName.exists || verifyDuplicateName.product?.id == productData.id){
        const productUpdated = await productService.update(productData);

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
        response.status(200).send(
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
      
      const productData: Product = {
        id: id,
        category_id: 0,
        costPrice: new Decimal(0),
        name: "",
        price: new Decimal(0),
        minimunQuantity: 0,
      }
      const productDeleted = await productService.delete(productData);

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
