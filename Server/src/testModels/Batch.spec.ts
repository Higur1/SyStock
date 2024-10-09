import { describe, it, expect, beforeAll, afterAll, jest, beforeEach } from "@jest/globals";
import Batch from "../entities/Batch";
import batch from "../models/Batch";
import category from "../models/Category";
import product from "../models/Product";
import Product from "../entities/Product";
import Decimal from "decimal.js";


describe("Create batch model", () => {

    let product_id;
    let category_id;
    let uniqueProductName;
    let uniqueCategoryName;
    let expirationDate;
    
    beforeAll(async () => {
        const genarateUniqueCategoryName = `Mock CategoryBatch-${String(Date.now())}`;
        uniqueCategoryName = genarateUniqueCategoryName;

        const mockCategory = {
            name:  uniqueCategoryName
        };

        const categoryResult = await category.create(mockCategory);
        category_id = categoryResult.category?.category_id;

        const genarateUniqueProductName = `Mock ProductBatch-${String(Date.now())}`;
        uniqueProductName = genarateUniqueProductName;

        const mockProduct: Product = {
            name: uniqueProductName,
            price: new Decimal (1500.00),
            costPrice: new Decimal (1000.00),
            minimunQuantity: 3,
            excludedStatus: false,
            observation: "De mesa",
            totalQuantityInStock: 0,
            category_id: category_id,
        };

        const productResult = await product.create(mockProduct);
        product_id = productResult.product?.id;

        expirationDate = new Date();

    });

    it("Should be able to create a new batch", async () => {
    
        const batchData: Batch = {
            eValidationStatus: 1,
            expirantionDate: expirationDate,
            product_id: product_id,
            quantity: 1,
            deletationStatus: false
        };

        const createBatch = await batch.create(batchData);

        await expect(createBatch).toHaveProperty("batch.id");
    });

    it("Should be not able to create a new batch | add quantity in batch alredy exists", async () =>{
        const batchData: Batch = {
            eValidationStatus: 1,
            expirantionDate: expirationDate,
            product_id: product_id,
            quantity: 3,
            deletationStatus: false
        };

        const createBatch = await batch.create(batchData);
        await expect(createBatch).toHaveProperty("message");
    });
});
