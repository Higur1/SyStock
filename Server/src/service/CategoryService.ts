import { prisma } from "../config/prisma";
import Category from "../models/Category";

export default class CategoryService {
  static async findAll() {
    try {
      const listOfCategory = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
        }
      });
      return listOfCategory != undefined
        ? { status: true, listOfCategory: listOfCategory }
        : { status: true, listOfCategory: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async create(categoryData: Category) {
    try {

      const categoryResult = await prisma.category.create({
        data: {
          name: categoryData.name,
          excludedStatus: false
        },
      });

      return categoryResult != undefined
        ? {
          status: true,
          category: {
            category_id: categoryResult.id,
            category_name: categoryResult.name,
          },
        }
        : { status: true,  message: "category alredy exists"  };
    } catch (error) {
      return { status: false, error: error};
    };
  };
  static async findById(categoryData: Category) {
    try {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryData.id,
          excludedStatus: false
        },
      });
      return category != undefined
        ? { status: true, category: category }
        : { status: true, category: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByTextsThatStartsWithName(categoryData: Category) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            startsWith: categoryData.name
          },
          excludedStatus: false
        },
        select: {
          id: true,
          name: true,
        }
      });
      return categories != undefined
        ? { status: true, categories: categories }
        : { status: true, categories: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByName(categoryData: Category) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            startsWith: categoryData.name
          },
          excludedStatus: false
        },
        select: {
          id: true,
          name: true,
        }
      });
      return categories != undefined
        ? { status: true, categories: categories }
        : { status: true, categories: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async update(categoryData: Category) {
    try {
      const categoryUpdated = await prisma.category.update({
        where: {
          id: categoryData.id,
          excludedStatus: false
        },
        data: {
          name: categoryData.name,
        },
        select: {
          id: true,
          name: true,
        }
      });
      return categoryUpdated != undefined
        ? { status: true, category: categoryUpdated }
        : { status: true, category: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async delete(categoryData: Category) {
    try {
      const categoryDeleted = await prisma.category.update({
        where: {
          id: categoryData.id,
        },
        data: {
          excludedStatus: true
        }
      });
      return categoryDeleted != undefined
        ? { status: true, category: categoryDeleted }
        : { status: true, category: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  };
};
