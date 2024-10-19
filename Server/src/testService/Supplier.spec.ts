import { describe, it, expect, beforeAll } from "@jest/globals";
import Supplier from "../models/Supplier";
import supplier from "../service/SupplierService";

describe("Create supplier model", () => {
  let supplierName;
  let supplierEmail;
  let supplierPhone;

  beforeAll(() => {
    const generateUniqueSupplierName = `Mock Supplier-${String(Date.now())}`;
    const genarateUniqueEmail = `Mock SupplierEmail-${String(Date.now())}`;
    const genarateUniquePhone = `Mock SupplierPhone-${String(Date.now())}`;

    supplierName = generateUniqueSupplierName;
    supplierEmail = genarateUniqueEmail;
    supplierPhone = genarateUniquePhone;
  });
  it("Dado um fornecedor X Quando criado no BD Então resultado deve ser igual ao id do fornecedor", async () => {
    const supplierData: Supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
      excludedStatus: false,
    };

    const createBatch = await supplier.create(supplierData);

    expect(createBatch).toHaveProperty("supplier.id");
  });

  it("Dado um fornecedor X Quando criado Então seu atributo excludedStatus deve ser igual a false", async () => {
    const supplierDataMock = new Supplier({
      name: "joao",
      email: "joao@gmail.com",
      phone: "11974846202",
    });

    expect(supplierDataMock.excludedStatus).toBe(false);
  });

  it("Dado um fornecedor X Quando há uma tentativa de cria-lo com dados unique já presentes em outros forncedores Então deve retornar uma mensagem informando que os dados já existem no BD", async () => {
    const supplierData: Supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
      excludedStatus: false,
    };

    const createBatch = await supplier.create(supplierData);

    expect(createBatch).toHaveProperty("message");
  });

  it("Dado um fornecedor X Quando deletado e é criado outro identico a ele Então resultado deve ser igual ao id do fornecedor", async () => {
    const supplierData: Supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
      excludedStatus: false,
    };

    supplierData.id = (await supplier.findByName(supplierName)).supplier?.id;
    await supplier.delete(supplierData);

    const createBatch = await supplier.create(supplierData);

    expect(createBatch).toHaveProperty("supplier.id");
  });

  afterAll(async () => {
    await supplier.deleteAll();
  });
});
