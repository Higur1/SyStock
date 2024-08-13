import { z } from "zod";
import Category from "../models/Category";
export default class CategoryController {
  static async listOfCategory(request, response) {
    try {
      const lisOfCategories = await Category.findAll();

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

      const categoryAlreadyExists = await Category.verifyDuplicateName(
        name
      );

      if (
        categoryAlreadyExists.status &&
        categoryAlreadyExists.category == undefined
      ) {
        const categoryCreated = await Category.create(name);

        if (categoryCreated.status) {
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

      const findCategory = await Category.findById(Number(id));

      if (findCategory.status) {
        response.status(200).send(
          JSON.stringify({
            category: findCategory.category,
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

      const findCategory = await Category.findByName(name);

      if (findCategory.status) {
        response.status(200).send(
          JSON.stringify({
            categories: findCategory.categories,
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
      const category = z.object({
        id: z.number().gt(0),
        name: z.string().trim().min(3).max(15),
      });
      const { id, name } = category.parse(request.body);

      const categoryAlredyExists = await Category.verifyDuplicateName(
        name
      );

      if (
        categoryAlredyExists.status &&
        categoryAlredyExists.category == undefined
      ) {
        const categoryUpdated = await Category.update(id, name);

        if (categoryUpdated.status) {
          response.status(200).send(
            JSON.stringify({
              category: categoryUpdated.category,
            })
          );
        } else {
          response.status(404).send(
            JSON.stringify({
              message: "Category not found",
            })
          );
        }
      } else {
        response.status(409).send(
          JSON.stringify({
            error: "Category alredy exists",
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
      const category = z.object({
        id: z.number().gt(0),
      });

      const { id } = category.parse(request.body);

      const categoryRemoved = await Category.delete(id);

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
