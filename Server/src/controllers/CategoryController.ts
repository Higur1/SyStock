import { z } from "zod";
import CategoryService from "../service/CategoryService";
import ICategory from "../interface/ICategory";
import { convertStringToNumber, dateBase, dateMask } from "../functions/baseFunctions";

export default class CategoryController {
  static async list(request, response) {
    try {
     
      const lisOfCategories = await CategoryService.findAll();
      response.status(200).send(JSON.stringify({
        Categories: lisOfCategories
      }));

    } catch (error) {
      console.log(error)
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async create(request, response) {
    try {
      const categoryValidation = z.object({
        name: z.string().trim().min(3).max(15),
      });
      const { name } = categoryValidation.parse(request.body);

      const categoryData: ICategory = {
        id: 0,
        name: name
      };
      const createCategory = await CategoryService.create(categoryData);

      response.status(200).send(JSON.stringify({
        Category: createCategory.categoria
      }));

    } catch (error) {
      if (error.message == "Category Already exists") {
        return response.status(409).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async findById(request, response) {
    try {
      const category_id = z.object({
        id: z.string(),
      });
      const { id } = category_id.parse(request.params);

      const convertString = convertStringToNumber(id);
      const category: ICategory = { id: convertString, name: "" };

      const findCategory = await CategoryService.find(category);

      //findCategory.category?.createdAt.setHours(findCategory.category?.createdAt.getHours()-3)
      const createAt = findCategory.category?.createdAt || dateBase();
      const resultDateMask = dateMask(createAt)
      
      console.log(resultDateMask)
      response.status(200).send(JSON.stringify({
        Category: findCategory.category
      }));
    } catch (error) {
      if (error.message == "Expected a number and received a string") {
        return response.status(400).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Category not found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async findByName(request, response) {
    try {
      const category_name = z.object({
        name: z.string().trim().min(1),
      });

      const { name } = category_name.parse(request.params);
      const categoryData: ICategory = { id: 0, name };

      const findCategory = await CategoryService.findByName(categoryData);

      response.status(200).send(JSON.stringify({
        Categories: findCategory.category
      }));

    } catch (error) {
      if (error.message === "Category not found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async listByName(request, response) {
    try {
      const category_name = z.object({
        name: z.string().trim().min(1).max(15),
      });

      const { name } = category_name.parse(request.params);
      const categoryData: ICategory = { id: 0, name };

      const findCategory = await CategoryService.listByName(categoryData);

      response.status(200).send(JSON.stringify({
        Categories: findCategory.categories
      }));

    } catch (error) {
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async edit(request, response) {
    try {
      const categoryNewData = z.object({
        id: z.number().gt(0),
        name: z.string().trim().min(3).max(15),
      });
      const { id, name } = categoryNewData.parse(request.body);

      const category: ICategory = {
        id: id,
        name: name
      };

      const categoryUpdated = await CategoryService.edit(category);

      response.status(200).send(JSON.stringify({
        Message: "Category updated successfully",
        Category: categoryUpdated.category
      }));
    } catch (error) {
      if (error.message === "Name of category already exists") {
        return response.status(409).send(JSON.stringify({
          Message: error.message,
        }));
      };
      if (error.message === "Category doesn't found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message,
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message,
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async delete(request, response) {
    try {
      const categoryValidation = z.object({
        id: z.string().trim().min(1),
      });

      const { id } = categoryValidation.parse(request.params);
      const convertString = convertStringToNumber(id);
      const categoryData: ICategory = { id: convertString, name: "" };

      await CategoryService.delete(categoryData);

      response.status(200).send(JSON.stringify({
        Message: "Category deleted successfully"
      }));
    } catch (error) {
      if (error.message == "Expected a number and received a string") {
        return response.status(400).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Category doesn't found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message,
        }));
      };
      if (error.message === "it is not possible to delete a category with registered products") {
        return response.status(409).send(JSON.stringify({
          Message: error.message,
        }));
      }
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message,
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error,
      }));
    };
  };
};
