import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import BatchService from "../service/BatchService";
import ProductService from "../service/ProductService";
import CategoryService from "../service/CategoryService";
import UserService from "../service/UserService";
import Decimal from "decimal.js";
import { prisma } from "../config/prisma";
import PreUserService from "../service/PreUserService";
import IBatch from "../interface/IBatch";
import IProduct from "../interface/IProduct";
import ICategory from "../interface/ICategory";
import IUser from "../interface/IUser";
import IPreUser from "../interface/IPreUser";

describe("Create Product model", () => {
  let categoryId;
  let UniqueName;
  let userEmail;
  let userLogin;
  let UserData;
  let PreUserData;

  beforeAll(async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    UniqueName = genarateUniqueProductName;

    const genarateUniqueCategoryName = `Mock CategoryProduct-${String(
      Date.now()
    )}`;

    const categoryData: ICategory = {
      name: genarateUniqueCategoryName,
    };

    const categoryResult = await CategoryService.create(categoryData);
    console.log(categoryResult);
    categoryId = categoryResult.category!.id;
    console.log(categoryId);

    const genarateUniqueEmail = `Mock UserEmailInProduct-${String(Date.now())}`;
    userEmail = genarateUniqueEmail;
    const genarateUniqueLogin = `Mock UserLoginInProduct-${String(Date.now())}`;
    userLogin = genarateUniqueLogin;

    PreUserData = new IPreUser({
      name: "userTestProduct",
      email: userEmail,
    });
    UserData = new IUser({
      name: "userTestProduct",
      login: userLogin,
      password: "senha",
      email: userEmail,
    });
  });
  it("Dado um produto X Quando há uma tentativa de criação com atributos válidos Então ele cria produto e cria um lote generico", async () => {
    const ProductData = new IProduct({
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });
    console.log(UserData);
    const createPreUser = await PreUserService.create(PreUserData);
    const createUser = await UserService.create(UserData);
    console.log(createUser);
    UserData.id = createUser.user?.id;
    console.log(UserData.id);
    const createProduct = await ProductService.create(ProductData);
    await expect(createProduct).toHaveProperty("product.id");

    console.log(createProduct.product?.id);
    const batchFinded = await prisma.batch.findFirst({
      where: { product_id: createProduct.product?.id },
    });
    console.log(batchFinded);
    await expect(batchFinded).not.toBe(null);
  });

  it("Dado um novo produto X Quando criado com uma  categoria inexistente Então ocorre um erro com a seguinte mensagem: 'Categoria é inexistente' e o bacth nao deve ser criado", async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    let UniqueNameNew = genarateUniqueProductName;
    const ProductData = new IProduct({
      name: UniqueNameNew,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: 50000,
    });

    const findedUser = await UserService.find(UserData);
    UserData.id = findedUser.user?.id;
    const createProduct = await ProductService.create(ProductData);

    await expect(createProduct.error).toBe("Categoria é inexistente");
    const batchFinded = await prisma.batch.findFirst({
      where: { product_id: createProduct.product?.id },
    });
    await expect(batchFinded).toBe(null);
  });

  it("Dado um produto X Quando criado no BD Então a quantidade em estoque deve ser 0 e o excludedStatus 'false'", async () => {
    const genarateUniqueProductName = `Mock Product-${String(Date.now())}`;
    let UniqueNameNew = genarateUniqueProductName;
    const ProductData = new IProduct({
      name: UniqueNameNew,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });
    const findedUser = await UserService.find(UserData);
    UserData.id = findedUser.user?.id;
    const createProduct = await ProductService.create(ProductData);
    ProductData.id = createProduct.product?.id;
    //como o excludedStatus n será retornado no método de criação do produto então vou pegá-lo no bd atraves do prisma
    const excludedStatus = await prisma.product.findFirst({
      where: { id: ProductData.id },
      select: { excludedStatus: true },
    });

    await expect(createProduct.product?.totalQuantityInStock).toBe(0);
    await expect(excludedStatus).toBe(false);
    const idParaApagar = (await ProductService.findByName(ProductData)).product
      ?.id;
    await prisma.product.update({
      where: { id: idParaApagar },
      data: { category_id: undefined },
    });
    const deleteProduct = await prisma.product.delete({
      where: { id: idParaApagar },
    });
    console.log(deleteProduct);
  });

  it("Dado um produto X não existente no BD Quando criado uma instancia do objeto dele Então a quantidade em estoque deve ser 0", async () => {
    const ProductData = new IProduct({
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
    const ProductData = new IProduct({
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      observation: "De mesa",
      category_id: categoryId,
    });

    const findedUser = await UserService.find(UserData);
    UserData.id = findedUser.user?.id;
    const createProduct = await ProductService.create(ProductData);

    await expect(createProduct.error).toBe("Name already exists");
    /*const idParaApagar = (await product.findByName(ProductData)).product?.id
    await prisma.product.delete({where: {id: idParaApagar}});*/
  });
  //pois o produto possui lotes

  it("Should not be able to delete a product", async () => {
    const ProductData: IProduct = {
      name: UniqueName,
      price: new Decimal(1500.0),
      costPrice: new Decimal(1000.0),
      minimunQuantity: 3,
      excludedStatus: false,
      observation: "De mesa",
      totalQuantityInStock: 0,
      category_id: categoryId,
    };
    const findedUser = await UserService.find(UserData);
    UserData.id = findedUser.user?.id;

    ProductData.id = (await ProductService.findByName(ProductData)).product?.id;
    console.log(ProductData);
    const batch = new IBatch({
      expirantionDate: new Date("2024-12-30T05:00:00.000Z"),
      quantity: 1,
      product_id: ProductData.id == undefined ? 0 : ProductData.id,
      batchs_fills: [],
    });

    const batchCreated = await BatchService.create(batch);

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

    const productExcluded = await ProductService.delete(ProductData);

    expect(productExcluded.message).toBe(
      "It is not possible to delete a product that has a quantity greater than zero "
    );
    //deletando batch do produto para poder deletar o produto no metodo abaixo (metodo com o nome Should be able to delete a produto')
    const idParaApagarBatch = (await batchService.findBatch(batch)).batch?.id;
    console.log(idParaApagarBatch, batch);
    await prisma.batch.delete({ where: { id: idParaApagarBatch } });
  }),
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
      console.log(ProductData);
      const productExcluded = await product.delete(ProductData);
      console.log(productExcluded);
      expect(productExcluded.status).toBe(true);
    }),
    afterAll(async () => {
      await prisma.category.delete({ where: { id: categoryId } });
    });
});
