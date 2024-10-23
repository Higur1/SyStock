import { z } from "zod";
import CategoryService from "../service/CategoryService";
import Category from "../models/Category";
export default class CategoryController {
  static async listOfCategory(request, response) {
    try {
      const lisOfCategories = await CategoryService.findAll();

      if (lisOfCategories.status) {
        response.status(200).send(
          JSON.stringify({
            categories: lisOfCategories.listOfCategory,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: lisOfCategories.error,
          })
        );
      }
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error,
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
      if (categoryAlreadyExists.status && categoryAlreadyExists.categories == 0
      ) {
        const categoryCreated = await CategoryService.create(categoryData);
        if (categoryCreated.status && !categoryCreated.error) {
          response.status(201).send(
            JSON.stringify({
              category: {
                id: categoryCreated.category?.category_id,
                name: categoryCreated.category?.category_name,
              },
            })
          );
        } else {
          response.status(500).send(
            JSON.stringify({
              error: categoryCreated.error,
            })
          );
        }
      } else {
        response.status(200).send(
          JSON.stringify({
            message: "Category already exists",
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
  }
  static async findById(request, response) {
    try {
      const category_id = z.object({
        id: z.string(),
      });
      const { id } = category_id.parse(request.params);

      const category: Category = { id: Number(id), name: "" };
      const findCategory = await CategoryService.findById(category);

      if (findCategory.status) {
        if (findCategory.category != undefined) {
          response.status(200).send(
            JSON.stringify({
              category: findCategory.category,
            })
          );
        }
        response.status(200).send(
          JSON.stringify({
            error: "Category don't exists",
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: findCategory.error,
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
  }
  static async findByName(request, response) {
    try {
      const category_name = z.object({
        name: z.string().trim().min(1).max(15),
      });

      const { name } = category_name.parse(request.params);
      const category: Category = { name };
      const findCategory = await CategoryService.findByName(category);

      if (findCategory.status) {
        if (findCategory.categories != undefined) {
          response.status(200).send(
            JSON.stringify({
              category: findCategory.categories,
            })
          );
        }
        response.status(200).send(
          JSON.stringify({
            error: "Category don't exists",
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: findCategory.error,
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
  }
  static async edit(request, response) {
    try {
      const categoryNewData = z.object({
        id: z.number().gt(0),
        name: z.string().trim().min(3).max(15),
      });
      const { id, name } = categoryNewData.parse(request.body);

      const category:Category = { 
        id: id, 
        name: name
       };
     
      const nameCategoryAlredyExists = await CategoryService.findByName(
        category
      );

      if (nameCategoryAlredyExists.status) {
        if (nameCategoryAlredyExists.categories != undefined) {
          response.status(200).send(
            JSON.stringify({
              error: "name of Category alredy exists",
            })
          );
        }
      }

      const idCategoryAlredyExists = await CategoryService.findById(category);

      if (idCategoryAlredyExists.status) {
        if (idCategoryAlredyExists.category == undefined) {
          response.status(200).send(
            JSON.stringify({
              message: "Category not found",
            })
          );
        }
      }
      const categoryUpdated = await CategoryService.update(category);

      if (categoryUpdated.status) {
        response.status(200).send(
          JSON.stringify({
            category: categoryUpdated.category,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: categoryUpdated.error,
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
  }
  static async delete(request, response) {
    try {
      const categoryData = z.object({
        id: z.number().gt(0),
      });

      const { id } = categoryData.parse(request.body);
      const category: Category = { id: id, name: "" };
      const categoryRemoved = await CategoryService.delete(category);

      if (categoryRemoved.status && categoryRemoved.category != undefined) {
        response.status(200);
      } else if (
        categoryRemoved.status &&
        categoryRemoved.category == undefined
      ) {
        response.status(200).send(
          JSON.stringify({
            message: "Category not found",
          })
        );
      } else {
        response.status(200).send(
          JSON.stringify({
            message:
              "it is not possible to delete a category with registered products",
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
  }
}
