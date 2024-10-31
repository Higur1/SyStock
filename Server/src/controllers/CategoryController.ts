import { z } from "zod";
import CategoryService from "../service/CategoryService";
import Category from "../models/Category";
import ProductService from "../service/ProductService";
export default class CategoryController {
  static async list(request, response) {
    try {
      const lisOfCategories = await CategoryService.findAll();

      if (lisOfCategories.status) {
        response.status(200).send(
          JSON.stringify({
            Categories: lisOfCategories.listOfCategory,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            Error: lisOfCategories.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          Error: error,
        })
      );
    }
  }
  static async create(request, response) {
    try {
      const categoryValidation = z.object({
        name: z.string().trim().min(3).max(15),
      });
      const { name } = categoryValidation.parse(request.body);

      const categoryData: Category = {
        name: name
      }
      const categoryAlreadyExists = await CategoryService.findByName(categoryData);
      console.log(categoryAlreadyExists)
      if (categoryAlreadyExists.exists) {
        response.status(409).send(
          JSON.stringify({
            Message: "Category already exists"
          })
        );
      } else {
        const categoryCreatedResult = await CategoryService.create(categoryData);

        if (categoryCreatedResult.status) {
          response.status(201).send(
            JSON.stringify({
              Category: categoryCreatedResult.categoria
            })
          )
        } else {
          response.status(500).send(
            JSON.stringify({
              Error: categoryCreatedResult.error,
            })
          )
        }
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
        })
      );
    }
  }
  static async findById(request, response) {
    try {
      const category_id = z.object({
        id: z.string(),
      });
      const { id } = category_id.parse(request.params);

      const category: Category = { id: Number(id), name: "" };
      const findCategory = await CategoryService.findById(category);
    
      if(!findCategory.status){
        response.status(500).send(
          JSON.stringify({
            Error: findCategory.error
          })
        );
      };
      if(!findCategory.exists){
        response.status(404).send(
          JSON.stringify({
            Message: "Category not found"
          })
        );
      }else{
        response.status(200).send(
          JSON.stringify({
            Category: findCategory.category
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
    }
  }
  static async findByName(request, response) {
    try {
      const category_name = z.object({
        name: z.string().trim().min(1).max(15),
      });

      const { name } = category_name.parse(request.params);
      const category: Category = { name };
      const findCategory = await CategoryService.findByTextsThatStartsWithName(category);

      if(!findCategory.status){
        response.status(500).send(
          JSON.stringify({
            Error: findCategory.error
          })
        );
      };
      if(!findCategory.exists){
        response.status(404).send(
          JSON.stringify({
            Message: "Category doesn't exist"
          })
        );
      }else{
        response.status(200).send(
          JSON.stringify({
            Category: findCategory.categories
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
  static async edit(request, response) {
    try {
      const categoryNewData = z.object({
        id: z.number().gt(0),
        name: z.string().trim().min(3).max(15),
      });
      const { id, name } = categoryNewData.parse(request.body);

      const category: Category = {
        id: id,
        name: name
      };

      const nameCategoryAlredyExists = await CategoryService.findByName(
        category
      );

      if(nameCategoryAlredyExists.exists){
        response.status(409).send(
          JSON.stringify({
            Message: "Name of category alredy exists"
          })
        );
      };

      const idCategoryAlredyExists = await CategoryService.findById(category);

      if(!idCategoryAlredyExists.status){
        response.status(500).send(
          JSON.stringify({
            Error: idCategoryAlredyExists.error
          })
        );
      };

      if(!idCategoryAlredyExists.exists){
        response.status(404).send(
          JSON.stringify({
            Message: "Category doesn't found"
          })
        );
      }else{
        const categoryUpdated = await CategoryService.update(category);

        if (!categoryUpdated.status){
          response.status(500).send(
            JSON.stringify({
              Error: categoryUpdated.error
            })
          );
        }
        response.status(200).send(
          JSON.stringify({
            Category: categoryUpdated.category
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
    }
  }
  static async delete(request, response) {
    try {
      const categoryData = z.object({
        id: z.string().trim().min(1),
      });

      const { id } = categoryData.parse(request.params);
      const category: Category = { id: Number(id), name: "" };

      const categoryRemoved = await CategoryService.delete(category);

      if(!categoryRemoved.status){
        response.status(404).send(
          JSON.stringify({
            Message: "Category doesn't found"
          })
        );
      };

      const verifyProductExistsInCategory = await ProductService.findByCategory(Number(id));
      console.log(verifyProductExistsInCategory)
      if(verifyProductExistsInCategory.exists){
        response.status(409).send(
          JSON.stringify({
            Message: "it is not possible to delete a category with registered products"
          })
        );
      };
      response.status(200).send(
        JSON.stringify({
          Message: "Category deleted successfully"
        })
      );
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error,
        })
      );
    };
  };
};
