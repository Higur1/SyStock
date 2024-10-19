import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Product from "../models/Product";
import Batch from "../models/Batch";
import batchService from "../service/BatchService";
import product from "../service/ProductService";
import category from "../service/CategoryService";
import Category from "../models/Category";
import Decimal from "decimal.js";
import { prisma } from "../config/prisma";
import { string } from "zod";

describe("Create Product model", () => {
  let categoryId;
  let UniqueName;

  beforeAll(async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    UniqueName = genarateUniqueProductName;

    const genarateUniqueCategoryName = `Mock CategoryProduct-${String(
      Date.now()
    )}`;

    const categoryData: Category = {
      name: genarateUniqueCategoryName,
    };

    const categoryResult = await category.create(categoryData);

    categoryId = categoryResult.category!.category_id;
  });
  it("Dado um produto X Quando há uma tentativa de criação com atributos válidos Então ele é criado com sucesso", async () => {
    const ProductData = new Product({
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });
    const createProduct = await product.create(ProductData);

    await expect(createProduct).toHaveProperty("product.id");
  });

  it("Dado um novo produto X Quando criado com uma  categoria inexistente Então ocorre um erro com a seguinte mensagem: 'Categoria é inexistente'", async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    let UniqueNameNew = genarateUniqueProductName;
    const ProductData = new Product({
      name: UniqueNameNew,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: 50000,
    });
    const createProduct = await product.create(ProductData);

    await expect(createProduct.error).toBe("Categoria é inexistente");
  });

  it("Dado um produto X Quando criado no BD Então a quantidade em estoque deve ser 0 e o excludedStatus 'false'", async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    let UniqueNameNew = genarateUniqueProductName;
    const ProductData = new Product({
      name: UniqueNameNew,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });
    const createProduct = await product.create(ProductData);
    ProductData.id = createProduct.product?.id;
    const verifyExcludedStatus = await product.getExcludedStatus(ProductData);

    await expect(createProduct.product?.totalQuantityInStock).toBe(0);
    await expect(verifyExcludedStatus.product?.excludedStatus).toBe(false);
  });

  it("Dado um produto X não existente no BD Quando criado uma instancia do objeto dele Então a quantidade em estoque deve ser 0", async () => {
    const ProductData = new Product({
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });

    await expect(ProductData.totalQuantityInStock).toBe(0);
  });

  it("Dado um produto X não criado Quando há uma tentativa de criação com um nome que já existe Então ele não é criado e a seguinte mensagem é exibida : 'Product alredy exists'", async () => {
    const ProductData = new Product({
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });
    const createProduct = await product.create(ProductData);

    await expect(createProduct.message).toBe("Product alredy exists");
  });
  it("Should be able to delete a produto", async () => {
    const ProductData: Product = {
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      excludedStatus: false,
      observation: "De mesa",
      totalQuantityInStock: 0,
      category_id: categoryId,
    };
    ProductData.id = (await product.findByName(ProductData)).product?.id;
    const productExcluded = await product.delete(ProductData);

    expect(productExcluded.status).toBe(true);
  }),
    //pois o produto possui lotes
    it("Should not be able to delete a product", async () => {
      const ProductData: Product = {
        name: UniqueName,
        price: new Decimal(1500.0),
        costPrice: new Decimal(1000.0),
        minimunQuantity: 3,
        excludedStatus: false,
        observation: "De mesa",
        totalQuantityInStock: 0,
        category_id: categoryId,
      };
      ProductData.id = (await product.findByName(ProductData)).product?.id;

      const batch = new Batch({
        expirantionDate: new Date("2024-12-30T05:00:00.000Z"),
        quantity: 1,
        product_id: ProductData.id == undefined ? 0 : ProductData.id,
      });

      const batchCreated = await batchService.create(batch);

      /*
        const dateEqual = new Date("2024-12-30T05:00:00.000Z")
        console.log("primeiro teste: " + batch.expirantionDate.toISOString() + " é igual " + dateEqual.toISOString() + " " + (batch.expirantionDate.toISOString()===dateEqual.toISOString()))
        const dateMenor = new Date("2024-11-30")
        console.log("segundo test
        e: " + batch.expirantionDate.toISOString() + " é igual " + dateMenor.toISOString() + " " + (batch.expirantionDate.toISOString()===dateMenor.toISOString()))
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

      expect(productExcluded.error).toBe("Não é possível deletar o produto! Produto possui quantidade em estoque!");
    }),
    afterAll(async () => {
      await product.deleteAll();
    });
});
