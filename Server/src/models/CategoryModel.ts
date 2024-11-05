import { prisma } from "../config/prisma";
import ICategory from "../interface/ICategory";

export default class CategoryModel {
  static async findAll() {
    try {
      const listOfCategory = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      return listOfCategory != undefined
        ? { status: true, listOfCategory: listOfCategory }
        : { status: true, listOfCategory: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async create(categoryData: ICategory) {
    try {
      const categoria = await prisma.category.create({
        data: {
          name: categoryData.name,
        },
      });

      return {status: true, categoria:categoria};
    } catch (error) {
      return { status: false, error: error };
    };
  } ;
  static async find(categoryData: ICategory) {
    try {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryData.id,
        },
      });
      return category != undefined
        ? { status: true, exists: true, category: category }
        : { status: true, exists: false, category: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByTextsThatStartsWithName(categoryData: ICategory) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            startsWith: categoryData.name,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
      return categories != undefined
        ? { status: true, exists: true, categories: categories }
        : { status: true, exists: false, categories: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findByName(categoryData: ICategory) {
    try {
      const category = await prisma.category.findFirst({
        where: {
          name: categoryData.name
        },
        select: {
          id: true,
          name: true,
        },
      });
      return category != undefined
        ? { status: true, exists: true, category: category }
        : { status: true, exists: false, category: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async edit(categoryData: ICategory) {
    try {
      const categoryUpdated = await prisma.category.update({
        where: {
          id: categoryData.id,
        },
        data: {
          name: categoryData.name,
        },
        select: {
          id: true,
          name: true,
        },
      });
      return categoryUpdated != undefined
        ? { status: true, category: categoryUpdated }
        : { status: true, category: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async delete(categoryData: ICategory) {
    try {
      const categoryDeleted = await prisma.category.delete({
        where: {
          id: categoryData.id,
        },
      });
      return categoryDeleted != undefined
        ? { status: true, exists: true, category: categoryDeleted }
        : { status: true, exists: false, category: {} };
    } catch (error) {
      return {status: false, categoryHaveProducts: true}
    };
  };
};
