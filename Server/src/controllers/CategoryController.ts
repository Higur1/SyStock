import { z } from "zod";
import Category from "../models/Category";
export default class CategoryController {
  static async listOfCategory(request, response) {
    try {
      const company_id = verifyTokenCompany(request.headers.authorization);
      const lisOfCategories = await Category.findAll(company_id);

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
      const company_id = verifyTokenCompany(request.headers.authorization);

      const categoryAlreadyExists = await Category.verifyDuplicateName(
        company_id,
        name
      );

      if (
        categoryAlreadyExists.status &&
        categoryAlreadyExists.category == undefined
      ) {
        const categoryCreated = await Category.create(company_id, name);

        if (categoryCreated.status) {
          response.status(201).send(
            JSON.stringify({
              category: {
                id: categoryCreated.category?.category_id,
                name: categoryCreated.category?.category_name,
                company_id: categoryCreated.category?.category_company_id,
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
      const company_id = verifyTokenCompany(request.headers.authorization);

      const findCategory = await Category.findById(company_id, Number(id));

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
      const company_id = verifyTokenCompany(request.headers.authorization);

      const findCategory = await Category.findByName(company_id, name);

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
      const company_id = verifyTokenCompany(request.headers.authorization);

      const categoryAlredyExists = await Category.verifyDuplicateName(
        company_id,
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
function verifyTokenCompany(token) {
  const headers = JSON.parse(atob(token.split(".")[1]));
  const parseToken = Object.values(headers)[2];
  return parseToken;
}
