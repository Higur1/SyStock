import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";

describe("Request to SupplierController - find all Suppliers", ()=>{
    it("Request status 200 - List of suppliers", () => {});
    it("Request status 200 - Empty list of suppliers", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to SupplierController - Create Supplier", ()=>{
    it("Request status 201 - User created", () => {});
    it("Request status 500 - Internal error supplierCreated.message", () => {});
    it("Request status 500 - Internal error SupplierValidated.message", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to SupplierController - Find by id", ()=>{
    it("Request status 200 - Find supplier by id", () => {});
    it("Request status 200 - Supplier not founded", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to SupplierController - Find by name", ()=>{
    it("Request status 200 - Find supplier by name", () => {});
    it("Request status 200 - Supplier not founded", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to SupplierController - Update Supplier", ()=>{
    it("Request status 200 - Supplier not founded", () => {});
    it("Request status 200 - Supplier updated", () => {});
    it("Request status 200 - Not possible update supplier", () => {});
    it("Request status 400 - invalid data type", () => {});
});
describe("Request to SupplierController - Delete Supplier", ()=>{
    it("Request status 200 - Supplier deleted", () => {});
    it("Request status 200 - Supplier not found", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});