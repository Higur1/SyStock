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
      expirantionDate: new Date('2024-10-02'),
      quantity: 1,
      product_id: product_id,
    });
    console.log(batchDatanew.expirantionDate)
    const createBatch = await BatchService.create(batchDatanew);

    await expect(createBatch).toHaveProperty("batch.id");
  });

  it("Should be able to create a new batch with eValidationStatus 2", async () => {
    /*const doisDiasAMaisDoAtual = new Date();
    doisDiasAMaisDoAtual.setDate(doisDiasAMaisDoAtual.getDate() + 2);*/
    const batchData = new Batch({
      expirantionDate: new Date('2024-10-18'),
      quantity: 1,
      product_id: product_id,
    });
console.log(product_id)
    const createBatch = await BatchService.create(batchData);

    await expect(createBatch).toHaveProperty("batch.id");
  });

  it("Should be able to create a new batch with eValidationStatus 3", async () => {
    /*const dezesseisDiasAMaisDoAtual = new Date();
    dezesseisDiasAMaisDoAtual.setDate(dezesseisDiasAMaisDoAtual.getDate() + 16);*/
    const batchData = new Batch({
      expirantionDate: /*dezesseisDiasAMaisDoAtual*/new Date('2024-10-31'),
      quantity: 1,
      product_id: product_id,
    });

    const createBatch = await BatchService.create(batchData);

    await expect(createBatch).toHaveProperty("batch.id");
  });

  it("Should be able to create a new batch with quantity 0, but deletationstatus will be true", async () => {
    const batchData = new Batch({
      expirantionDate: new Date('2024-10-20'),
      quantity: 0,
      product_id: product_id,
    });
    const createBatch = await BatchService.create(batchData);
    await expect(createBatch.batch?.deletionStatus).toBe(true);
  });

  it("Should be not able to create a new batch | add quantity in batch alredy exists", async () => {
    const batchData = new Batch({
      expirantionDate: new Date('2024-10-18'),
      quantity: 9,
      product_id: product_id,
    });
    const createBatch = await BatchService.create(batchData);
    await expect(createBatch).toHaveProperty("message");
  });

  afterAll(async () => {
    //      await product.deleteAll();
  });
});
