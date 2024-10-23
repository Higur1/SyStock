import { prisma } from "../config/prisma";
import Category from "../models/Category";
import { Prisma } from "@prisma/client";

export default class CategoryService {
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
    }
  }
  static async create(categoryData: Category) {
    try {
      const categoryResult = await prisma.category.create({
        data: {
          name: categoryData.name,
          excludedStatus: false
        },
      });

      return {
        status: true,
        category: {
          category_id: categoryResult.id,
          category_name: categoryResult.name,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return { status: false, error: "Já existe categoria com esse nome" };
        }
      }
      return { status: false, error: error };
    }
  }
  static async findById(categoryData: Category) {
    try {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryData.id,
        },
      });
      return category != undefined
        ? { status: true, category: category }
        : { status: true, category: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByTextsThatStartsWithName(categoryData: Category) {
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
        ? { status: true, categories: categories }
        : { status: true, categories: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findByName(categoryData: Category) {
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
        ? { status: true, categories: categories }
        : { status: true, categories: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(categoryData: Category) {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return { status: false, error: "Já existe categoria com esse nome" };
        }
      }
      return { status: false, error: error };
    }
  }
  static async delete(categoryData: Category) {
    try {
      const categoryDeleted = await prisma.category.delete({
        where: {
          id: categoryData.id,
        },
      });
      return categoryDeleted != undefined
        ? { status: true, category: categoryDeleted }
        : { status: true, category: {} };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return { status: false, error: "Não existe Categoria com o ID informado" };
        }
      }
      return { status: false, error: error };
    }
  }
}
