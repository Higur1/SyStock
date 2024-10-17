import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Product from "../models/Product";
import Batch from "../models/Batch";
import batchService from "../service/BatchService";
import product from "../service/ProductService";
import category from "../service/CategoryService"
import Category from "../models/Category";
import Decimal from "decimal.js"
import { prisma } from "../config/prisma";
import { string } from "zod";

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
    it("Should not be able to delete a product", async () => {

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
//            eValidationStatus: 3,
            //expirantionDate: new Date("2024-12-30"),
            expirantionDate: new Date("2024-12-30T05:00:00.000Z"),
            product_id: ProductData.id == undefined ? 0 : ProductData.id, 
            deletationStatus: false
        };

        const batchCreated = await batchService.create(batch);

        /*
        const dateEqual = new Date("2024-12-30T05:00:00.000Z")
        console.log("primeiro teste: " + batch.expirantionDate.toISOString() + " é igual " + dateEqual.toISOString() + " " + (batch.expirantionDate.toISOString()===dateEqual.toISOString()))
        const dateMenor = new Date("2024-11-30")
        console.log("segundo teste: " + batch.expirantionDate.toISOString() + " é igual " + dateMenor.toISOString() + " " + (batch.expirantionDate.toISOString()===dateMenor.toISOString()))
        const dateMaior = new Date("2024-12-31")
        console.log("terceiro teste: " + batch.expirantionDate.toISOString() + "é maior que " + dateMaior.toISOString() + " " + (batch.expirantionDate.toISOString() > dateMaior.toISOString()))
        console.log("quarto teste: " + dateMaior.toISOString() + " é maior que " + batch.expirantionDate.toISOString() + " " + (dateMaior.toISOString() > batch.expirantionDate.toISOString()))
        console.log("quinto teste: " + batch.expirantionDate.toISOString() + " é  maior que " + dateEqual.toISOString() + " " + (batch.expirantionDate.toISOString()>dateEqual.toISOString()))
        console.log("sexto teste: " + dateEqual.toISOString() + " é  maior que " + batch.expirantionDate.toISOString() + " " + (dateEqual.toISOString()>batch.expirantionDate.toISOString()))
        console.log("sétimo teste: " + batch.expirantionDate.toISOString() + " é menor que " + dateMenor.toISOString() + " " + (batch.expirantionDate.toISOString() < dateMenor.toISOString()))
        console.log("oitavo teste: " + dateMenor.toISOString() + " é menor que " + batch.expirantionDate.toISOString() + " " + (dateMenor.toISOString() < batch.expirantionDate.toISOString()))
        const hourMaior = new Date("2024-12-30T10:00:00.000Z");
        console.log("nono teste: " + batch.expirantionDate.toISOString() + " é maior " + hourMaior.toISOString() + " " + (batch.expirantionDate.toISOString() > hourMaior.toISOString()))
        console.log("decimo teste: " + hourMaior.toISOString() + " é maior " + batch.expirantionDate.toISOString() + " " + (hourMaior.toISOString() > batch.expirantionDate.toISOString()))
        const hourMenor = new Date("2024-12-30T03:00:00.000Z");
        console.log("decimo primeiro teste: " + batch.expirantionDate.toISOString() + " é menor " + hourMenor.toISOString() + " " + (batch.expirantionDate.toISOString() < hourMenor.toISOString()))
        console.log("decimo segundo teste: " + hourMenor.toISOString() + " é menor " + batch.expirantionDate.toISOString() + " " + (hourMenor.toISOString() < batch.expirantionDate.toISOString()))
        console.log("decimo terceiro: " + batch.expirantionDate.toISOString() + " é  menor que " + dateEqual.toISOString() + " " + (batch.expirantionDate.toISOString() < dateEqual.toISOString()))
        console.log("decimo quarto: " + batch.expirantionDate.toISOString().substring(0,9) + " apenas data é igual a " + dateEqual.toISOString().substring(0,9) + " " + (batch.expirantionDate.toISOString().substring(0,9).localeCompare(dateEqual.toISOString().substring(0,9))))
        console.log("decimo quinto: " + batch.expirantionDate.toISOString().substring(0,9) + " apenas data é igual a " + dateMenor.toISOString().substring(0,9) + " " +(batch.expirantionDate.toISOString().substring(0,9).localeCompare(dateMenor.toISOString().substring(0,9))));
        console.log("decimo sexto: " + batch.expirantionDate.toLocaleDateString().substring(0,9) + " apenas data é igual a " + dateMenor.toISOString().substring(0,9) + " " +(batch.expirantionDate.toISOString().substring(0,9).localeCompare(dateMenor.toISOString().substring(0,9))));
        console.log("decimo sétimo: " + batch.expirantionDate.toLocaleDateString().substring(0,9) + " apenas data é maior a " + dateMenor.toISOString().substring(0,9) + " " +(batch.expirantionDate.toISOString().substring(0,9) > dateMenor.toISOString().substring(0,9)));
       
        const dateNow = new Date();
        dateNow.setHours(0);
        dateNow.setMinutes(0);
        dateNow.setMilliseconds(0);
        console.log("datenow"+dateNow);
        console.log("toIso"+dateNow.toISOString()); 
        const daqSeteDIas = new Date();
        daqSeteDIas.setDate(30)
        daqSeteDIas.setMonth(0);
        daqSeteDIas.setDate(daqSeteDIas.getDate());
        console.log(daqSeteDIas + " dia escolhido");
        daqSeteDIas.setDate(daqSeteDIas.getDate()+7);
        dateNow.getUTCMilliseconds();
        dateNow.setMinutes(0);
        dateNow.setMilliseconds(0);
        console.log("daq sete dias " + daqSeteDIas);
        // console.log("decimo oitavo: " + batch.expirantionDate.toLocaleDateString().substring(0,9) + " apenas data é maior a " + dateMenor.toISOString().substring(0,9) + " " +(batch.expirantionDate.toISOString().substring(0,9) > dateMenor.toISOString().substring(0,9)));


/*        await prisma.batch.create({
            data: {
                deletionStatus: false
            }
        });*/
        const productExcluded = await product.delete(ProductData);

        expect(productExcluded).toHaveProperty("mensagem");
    }),
    afterAll(async () => {
        await product.deleteAll();
    });
});

