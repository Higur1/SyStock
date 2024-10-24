import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  jest,
  beforeEach,
} from "@jest/globals";
import Batch from "../models/Batch";
import batchService from "../service/BatchService";
import category from "../service/CategoryService";
import product from "../service/ProductService";
import Product from "../models/Product";
import Decimal from "decimal.js";
import BatchService from "../service/BatchService";
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

    const mockCategory = {
      name: uniqueCategoryName,
    };

    const categoryResult = await category.create(mockCategory);
    category_id = categoryResult.category?.category_id;

    const genarateUniqueProductName = `Mock ProductBatch-${String(Date.now())}`;
    uniqueProductName = genarateUniqueProductName;

    const mockProduct: Product = {
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
    product_id = productResult.product?.id;
  });

  it("Should be able to create a new batch", async () => {
    const batchDatanew = new Batch({
      expirantionDate: new Date("2024-10-02"),
      quantity: 1,
      product_id: product_id,
    });
    
    const createBatch = await BatchService.create(batchDatanew);
    console.log(createBatch)
    await expect(createBatch).toHaveProperty("batch.id");
  });

  it("Should be able to create a new batch with eValidationStatus 2", async () => {

    const batchData = new Batch({
      expirantionDate: new Date("2024-10-18"),
      quantity: 1,
      product_id: product_id,
    });

    const createBatch = await BatchService.create(batchData);

    await expect(createBatch).toHaveProperty("batch.id");
  });
  
  it("Should be able to create a new batch with eValidationStatus 3", async () => {
    const batchData = new Batch({
      expirantionDate:  new Date("2024-10-31T10:05:00.000Z"),
      quantity: 1,
      product_id: product_id,
    });

    const createBatch = await BatchService.create(batchData);

    await expect(createBatch).toHaveProperty("batch.id");
    const idParaApagarBatch = ((await batchService.findBatch(batchData)).batch?.id)
    console.log(idParaApagarBatch)
    await prisma.batch.delete({where: {id: idParaApagarBatch}});
  });

  it("Should be able to delete a batch", async () => {
    const batchDatanew = new Batch({
      expirantionDate: new Date("2024-10-02"),
      quantity: 1,
      product_id: product_id,
    });
    batchDatanew.id = (await batchService.findBatch(batchDatanew)).batch?.id
    console.log(batchDatanew)
    const batchDeleted = await batchService.delete(batchDatanew) 

    await expect(batchDeleted.status).toBe(true);
  });
/*
  afterAll(async () => {
    const batchencontrado = await prisma.batch.findFirst({where: {product_id: product_id}});
    console.log(batchencontrado)
    const encontrado = await prisma.product.findUnique({where: {id: product_id}});
    console.log(encontrado)
    await prisma.product.delete({where: {id: product_id}});
    await prisma.category.delete({where: {id: category_id}});
  });*/
});
