import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  jest,
  beforeEach,
} from "@jest/globals";
import category from "../service/CategoryService";
import product from "../service/ProductService";

import Decimal from "decimal.js";
import BatchService from "../service/BatchService";
import ICategory from "../interface/ICategory";
import IProduct from "../interface/IProduct";
import IBatch from "../interface/IBatch";
import { prisma } from "../config/prisma";

describe("Create batch model", () => {
  let product_id;
  let category_id;
  let uniqueProductName;
  let uniqueCategoryName;

  beforeAll(async () => {
    const genarateUniqueCategoryName = `Mock CategoryBatch-${String(
      Date.now()
    )}`;
    uniqueCategoryName = genarateUniqueCategoryName;

    const mockCategory: ICategory = {
      name: uniqueCategoryName,
    };

    const categoryResult = await category.create(mockCategory);
    category_id = categoryResult.category?.id;

    const genarateUniqueProductName = `Mock ProductBatch-${String(Date.now())}`;
    uniqueProductName = genarateUniqueProductName;

    const mockProduct: IProduct = {
      name: uniqueProductName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      excludedStatus: false,
      observation: "De mesa",
      totalQuantityInStock: 0,
      category_id: category_id,
    };

    const productResult = await product.create(mockProduct);
    product_id = productResult.createResult?.product?.id;

  });

  it("Should be able to create a new batch", async () => {
    const batchDatanew: IBatch = ({
      expirantionDate: new Date("2024-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: product_id,
    });
    
    const createBatch = await BatchService.create(batchDatanew);
    await expect(createBatch).toHaveProperty("batch.id");
    batchDatanew.id = createBatch.batch!.id;
    await prisma.batch.deleteMany({where:{product_id: batchDatanew.product_id}});
  });
  it("Should not be able to create a new bathc, Because product not found", async () => {
    const batchDatanew: IBatch = ({
      expirantionDate: new Date("2025-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: 999999999999,
    });

    await expect (async () => await BatchService.create(batchDatanew)).rejects.toThrowError("Product not found")
  });
  it("Should not be able to create a new batch, because expirationDate already exists", async () =>{
    const batchDatanew: IBatch = ({
      expirantionDate: new Date("2026-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: product_id,
    });
    const createBatch = await BatchService.create(batchDatanew);
    await expect (async () => await BatchService.create(batchDatanew)).rejects.toThrowError("Batch with expiration date already exists")
    await prisma.batch.delete({where:{id: createBatch.batch?.id}});
  });
  it("Should be able to find a batch", async () => {
    const batchDatanew: IBatch = ({
      expirantionDate: new Date("2027-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: product_id,
    });
    const createBatch = await BatchService.create(batchDatanew);
    batchDatanew.id = createBatch.batch?.id;
    const findBatch = await BatchService.find(batchDatanew);
    
    await expect(findBatch).toHaveProperty("batch");
    await prisma.batch.delete({where:{id: findBatch.batch.id}});
  });
  it("Should not be possible to find a batch, because batch not found", async () => {
    const batchDatanew: IBatch = ({
      expirantionDate: new Date("2027-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: product_id,
    });
    await expect(async () => await BatchService.find(batchDatanew)).rejects.toThrowError("Batch not found")
  });
  it("Should be able to delete a batch", async () => {
    const batchDatanew = new IBatch({
      expirantionDate: new Date("2028-01-01T00:00:01.000Z"),
      quantity: 0,
      product_id: product_id,
    });
    const createBatch = await BatchService.create(batchDatanew);
    batchDatanew.id = createBatch.batch!.id
    const batchDeleted = await BatchService.delete(batchDatanew) 

    await expect(batchDeleted.status).toBe(true);
  });
 

  afterAll(async () => {
    await prisma.product.delete({where: {id: product_id}});
    await prisma.category.delete({where: {id: category_id}});
  });
});
