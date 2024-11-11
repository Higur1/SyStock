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
    const genarateUniqueCategoryName = `Mock Category-${String(Date.now())}`
    UniqueName = genarateUniqueCategoryName;
  });

  it("Should be able to create a new category", async () => {
    const categoryData: ICategory = {
      name: UniqueName,
    };

    const createCategory = await CategoryService.create(categoryData);
    await expect(createCategory.category).toHaveProperty("id");
  });

  it("Should not be able ot create a new category", async () => {
    const categoryData: ICategory = {
      name: UniqueName,
    };
    await expect(async () => await CategoryService.create(categoryData)).rejects.toThrowError("Category Already exists")
  });

  it("Dado uma categoria já existente Quando seu nome é alterado para um nome que não existe no BD Então o nome da categoria recebe seu novo nome", async () => {
    const genarateUniqueCategoryNameUpdated =  `Mock Category-${String(Date.now())}`
    const generateNewName = `Update Mock Category-${String(Date.now())}`

    const categoryDataCreate: ICategory = {
      name: genarateUniqueCategoryNameUpdated,
    };

    const createResult = await CategoryService.create(categoryDataCreate)

    const newCategoryData: ICategory = {
      id: createResult.category?.id,
      name: generateNewName
    };

    const editResult = await CategoryService.edit(newCategoryData)

    await expect(editResult.category!.name).toBe(generateNewName);
 
  });

  it("Dado uma categoria já existente Quando seu nome é alterado para um nome que já existe no BD Então é retornado o seguinte erro: 'Já existe uma categoria com esse nome'", async () => {
    const genarateUniqueCategoryName = `Mock Category-${String(Date.now())}`;
    const categoryData: ICategory = {
      name: genarateUniqueCategoryName,
    };

    const createCategory = await CategoryService.create(categoryData);
    const findCategory = await CategoryService.findByName(UniqueName);

    const newCategoryData: ICategory = {
      id: createCategory.category?.id,
      name: findCategory.category!.name || ""
    };

  await expect (async () => await CategoryService.edit(newCategoryData)).rejects.toThrowError("Name of category already exists")
  });

  it("Should be able to delete a category", async () => {
    const categoryData: ICategory = {
      id: categoryId,
      name: UniqueName,
    };
    const newCategoryData:  ICategory ={
      name: `Mock Category-${String(Date.now())}`
    };
    const createResult = await CategoryService.create(newCategoryData)
    newCategoryData.id = createResult.category?.id;

    const deletedCategory = await CategoryService.delete(newCategoryData);

    await expect(deletedCategory.status).toBe(true);
  });

  it("Should not be able to delete a category", async () => {
    const newCategoryData: ICategory = {
      id: 9999999,
      name: "Name not exists"
    };
    await expect(CategoryService.delete(newCategoryData)).rejects.toThrowError(
      "Category doesn't found"
    );

  });

  afterAll(async () => {
    await prisma.category.deleteMany({});
  });
});
