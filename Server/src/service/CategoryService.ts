import ICategory from "../interface/ICategory";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";

export default class CategoryService {
  static async findAll() {
    try {
      const categories = await CategoryModel.findAll();

      return categories.listOfCategory;
    } catch (error) {
      throw error;
    }
  }
  static async create(categoryData: ICategory) {
    try {
      const categoryAlreadyExists = await CategoryModel.findByName(
        categoryData
      );

      if (categoryAlreadyExists.exists) {
        throw new Error("Category Already exists");
      }
      const createCategory = await CategoryModel.create(categoryData);

      return createCategory;
    } catch (error) {
      throw error;
    }
  }
  static async find(categoryData: ICategory) {
    try {
      const findCategory = await CategoryModel.find(categoryData);

      if (!findCategory || !findCategory.exists) {
        throw new Error("Category not found");
      }

      return findCategory;
    } catch (error) {
      throw error;
    }
  }
  static async findByName(categoryData: ICategory) {
    try {
      const findCategory = await CategoryModel.findByName(categoryData);

      if (!findCategory.exists) {
        throw new Error("Category not found");
      }

      return findCategory;
    } catch (error) {
      throw error;
    }
  }
  static async listByName(categoryData: ICategory) {
    try {
      const listCategories = await CategoryModel.findByTextsThatStartsWithName(
        categoryData
      );

      return listCategories;
    } catch (error) {
      throw error;
    }
  }
  static async edit(categoryData: ICategory) {
    try {
      const verifyDuplicateName = await CategoryModel.findByName(categoryData);

      if (verifyDuplicateName && verifyDuplicateName.exists) {
        throw new Error("Name of category already exists");
      }

      const verifyCategoryExists = await CategoryModel.find(categoryData);

      if (!verifyCategoryExists.exists) {
        throw new Error("Category doesn't found");
      }

      const editCategoryResult = await CategoryModel.edit(categoryData);
      return editCategoryResult;
    } catch (error) {
      throw error;
    }
  }
  static async delete(categoryData: ICategory) {
    try {
      const findCategory = await CategoryModel.find(categoryData);
      if (!findCategory.exists) {
        throw new Error("Category doesn't found");
      }
      const verifyProductExistsInCategory = await ProductModel.findByCategory(
        findCategory.category?.id || 0,
        
        categoryData.id
      );

      if (verifyProductExistsInCategory.products!.length > 0) {
        throw new Error(
          "it is not possible to delete a category with registered products"
        );
      }

      const categoryRemove = await CategoryModel.delete(categoryData);
      return categoryRemove;
    } catch (error) {
      throw error;
    }
  }
}
