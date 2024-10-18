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
  it("Should be able to create a new Supplier with mockUnique", async () => {
    const supplierData: Supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
      excludedStatus: false,
    };

    const createBatch = await supplier.create(supplierData);

    expect(createBatch).toHaveProperty("supplier.id");
  });

  it("Should be verify if excludedStatus is false when a new Supplier is created", async () => {
    const supplierDataMock = new Supplier({
      name: "joao",
      email: "joao@gmail.com",
      phone: "11974846202",
    });

    expect(supplierDataMock.excludedStatus).toBe(false);
  });

  it("Should be able to create a new Supplier with mock", async () => {
    const supplierDataMock = new Supplier({
      name: "joao",
      email: "joao@gmail.com",
      phone: "11974846202",
    });

    const supplierCreated = await supplier.create(supplierDataMock);

    expect(supplierCreated).toHaveProperty("supplier.id");
  });

  it("Should be not able to create a new Supplier", async () => {
    const supplierData: Supplier = {
      name: supplierName,
      email: supplierEmail,
      phone: supplierPhone,
      excludedStatus: false,
    };

    const createBatch = await supplier.create(supplierData);

    expect(createBatch).toHaveProperty("message");
  });
  afterAll(async () => {
    //await supplier.deleteAll();
  });
});
