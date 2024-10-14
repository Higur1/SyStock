import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Product from "../models/Product";
import Batch from "../models/Batch";
import product from "../service/ProductService";
import category from "../service/CategoryService"
import Category from "../models/Category";
import Decimal from "decimal.js"
import { prisma } from "../config/prisma";

describe("Create Product model", () => {

    let categoryId;
    let UniqueName;

    beforeAll(async ()=>{
        const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
        UniqueName = genarateUniqueProductName;

        const genarateUniqueCategoryName = `Mock CategoryProduct-${String(Date.now())}`;

        const categoryData: Category = {
            name: genarateUniqueCategoryName
        };
    
        const categoryResult = await category.create(categoryData);
  
        categoryId = categoryResult.category!.category_id;

    });
    it("Should be able to create a new Product", async () => {

        const ProductData: Product = {
            name: UniqueName,
            price: new Decimal (1500.00),
            costPrice: new Decimal (1000.00),
            minimunQuantity: 3,
            excludedStatus: false,
            observation: "De mesa",
            totalQuantityInStock: 0,
            category_id: categoryId,
        };
        const createProduct = await product.create(ProductData);

        await expect(createProduct).toHaveProperty("product.id");
    });
    it("Should not be able to create a new Product", async () => {

        const ProductData: Product = {
            name: UniqueName,
            price: new Decimal (1500.00),
            costPrice: new Decimal (1000.00),
            minimunQuantity: 3,
            excludedStatus: false,
            observation: "De mesa",
            totalQuantityInStock: 0,
            category_id: categoryId,
        };
        const createProduct = await product.create(ProductData);

        await expect(createProduct).toHaveProperty("message");
    });
    it("Should be able to delete a produto", async () => {
        
        const ProductData: Product = {
            name: UniqueName,
            price: new Decimal (1500.00),
            costPrice: new Decimal (1000.00),
            minimunQuantity: 3,
            excludedStatus: false,
            observation: "De mesa",
            totalQuantityInStock: 0,
            category_id: categoryId,
        };
        ProductData.id = ((await product.findByName(ProductData)).product?.id);
        const productExcluded = await product.delete(ProductData);


        expect(productExcluded.status).toBe(true);
    }),

    //pois o produto possui lotes
 /*   it("Should not be able to delete a product", async () => {

        const ProductData: Product = {
            name: UniqueName,
            price: new Decimal (1500.00),
            costPrice: new Decimal (1000.00),
            minimunQuantity: 3,
            excludedStatus: false,
            observation: "De mesa",
            totalQuantityInStock: 0,
            category_id: categoryId,
        };
        ProductData.id = ((await product.findByName(ProductData)).product?.id);

        const batch : Batch = {
            quantity: 1, 
            eValidationStatus: 3,
            expirantionDate: new Date("2024-12-30"),
            product_id: ProductData.id == undefined ? 0 : ProductData.id, 
            deletationStatus: false
        };
        
        await prisma.batch.create({
            data: {
                deletionStatus
            }
        });
        const productExcluded = await product.delete(ProductData);

        expect(productExcluded.status).toHaveProperty("mensagem");
    }),*/
    afterAll(async () => {
        await product.deleteAll();
    });
});

