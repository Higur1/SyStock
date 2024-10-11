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
      const category_name = z.object({
        name: z.string().trim().min(3).max(15),
      });
      const { name } = category_name.parse(request.body);

      const category = new Category({ name });
      const categoryAlreadyExists = await CategoryService.findByName(category);

      if (
        categoryAlreadyExists.status &&
        categoryAlreadyExists.categories == undefined
      ) {
        const categoryCreated = await CategoryService.create(category);

        if (categoryCreated.status && !categoryCreated.message) {
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
        response.status(409).send(
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

      const category = new Category({ name: "" });
      category.id = Number(id);
      const findCategory = await CategoryService.findById(category);

      if (findCategory.status) {
        if (findCategory.category != undefined) {
          response.status(200).send(
            JSON.stringify({
              category: findCategory.category,
            })
          );
        }
        response.status(404).send(
          JSON.stringify({
            error: "Categoria não existe",
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
      const category = new Category({ name });
      const findCategory = await CategoryService.findByName(category);

      if (findCategory.status) {
        if (findCategory.categories != undefined) {
          response.status(200).send(
            JSON.stringify({
              category: findCategory.categories,
            })
          );
        }
        response.status(404).send(
          JSON.stringify({
            error: "Categoria não existe",
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

      const category = new Category({ name });
      category.id = id;
      const nameCategoryAlredyExists = await CategoryService.findByName(
        category
      );

      if (nameCategoryAlredyExists.status) {
        if (nameCategoryAlredyExists.categories != undefined) {
          response.status(409).send(
            JSON.stringify({
              error: "name of Category alredy exists",
            })
          );
        }
      }

      const idCategoryAlredyExists = await CategoryService.findById(category);

      if (idCategoryAlredyExists.status) {
        if (idCategoryAlredyExists.category == undefined) {
          response.status(404).send(
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
  static async remove(request, response) {
    try {
      const categoryData = z.object({
        id: z.number().gt(0),
      });

      const { id } = categoryData.parse(request.body);
      const category = new Category({ name: "" });
      category.id = Number(id);
      const categoryRemoved = await CategoryService.delete(category);

      if (categoryRemoved.status && categoryRemoved.category != undefined) {
        response.status(200);
      } else if (
        categoryRemoved.status &&
        categoryRemoved.category == undefined
      ) {
        response.status(404).send(
          JSON.stringify({
            message: "Category not found",
          })
        );
      } else {
        response.status(400).send(
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
