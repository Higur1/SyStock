import CategoryService from "../service/CategoryService";
import ICategory from "../interface/ICategory";
import { prisma } from "../config/prisma";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";

describe("Create category model", () => {
  let categoryId;
  let UniqueName;
  let UniqueNameUpdate;

  beforeAll(() => {
    const genarateUniqueCategoryName = `Mock Category-${String(Date.now())}`;
    UniqueName = genarateUniqueCategoryName;
  });

  it("Should be able to create a new category", async () => {
    const categoryData: ICategory = {
      name: UniqueName,
    };

    const createCategory = await CategoryService.create(categoryData);
    categoryId = createCategory.category!.id;
    await expect(createCategory).toHaveProperty("category.category_id");
  });

  it("Should not be able ot create a new category", async () => {
    const categoryData: ICategory = {
      name: UniqueName,
    };

    const createCategory = await CategoryService.create(categoryData);
    await expect(createCategory.error).toBe(
      "Já existe categoria com esse nome"
    );
  });

  it("Dado uma categoria já existente Quando seu nome é alterado para um nome que não existe no BD Então o nome da categoria recebe seu novo nome", async () => {
    const genarateUniqueCategoryNameUpdated = `Update Mock Category-${String(
      Date.now()
    )}`;
    UniqueNameUpdate = genarateUniqueCategoryNameUpdated;
    const categoryDataUpdate: ICategory = {
      id: categoryId,
      name: UniqueNameUpdate,
    };

    const updatedCategory = await CategoryService.edit(categoryDataUpdate);
    await expect(updatedCategory.category?.name).toBe(UniqueNameUpdate);
  });

  it("Dado uma categoria já existente Quando seu nome é alterado para um nome que já existe no BD Então é retornado o seguinte erro: 'Já existe uma categoria com esse nome'", async () => {
    const genarateUniqueCategoryName = `Mock Category-${String(Date.now())}`;
    UniqueName = genarateUniqueCategoryName;
    const categoryData: ICategory = {
      name: UniqueName,
    };

    const createCategory = await CategoryService.create(categoryData);

    categoryData.name = UniqueNameUpdate;

    categoryData.id = createCategory.category?.id;

    const updatedCategory = await CategoryService.edit(categoryData);
    await expect(updatedCategory.error).toBe(
      "Já existe categoria com esse nome"
    );
  });

  it("Should be able to delete a category", async () => {
    const categoryData: ICategory = {
      id: categoryId,
      name: UniqueName,
    };

    const deletedCategory = await CategoryService.delete(categoryData);

    await expect(deletedCategory.status).toBe(true);
  });

  it("Should not be able to delete a category", async () => {
    const categoryData: ICategory = {
      id: 50000,
      name: UniqueName,
    };

    const deletedCategory = await CategoryService.delete(categoryData);

    await expect(deletedCategory.error).toBe(
      "Não existe Categoria com o ID informado"
    );
  });

  afterAll(async () => {
    await prisma.category.deleteMany({});
  });
});
