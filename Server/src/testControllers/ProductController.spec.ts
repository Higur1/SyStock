import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";

describe("Request to ProductController - find all products", ()=>{
    it("Request status 200 - List of products", () => {});
    it("Request status 200 - Empty list of products", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to ProductController - Create product", () => {
    it("Request status 201 - Product created", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 200 - SupplierCreated.error = Supplier alredy exists", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to ProductController - Find by id", () => {
    it("Request status 200 - List of products", () => {});
    it("Request status 200 - Empty list of products", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to ProductController - Find by name", () => {
    it("Request status 200 - List of products", () => {});
    it("Request status 200 - Empty list of products", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to ProductController - Update product", () => {
    it("Request status 200 - Supplier not found", () => {});
    it("Request status 200 - Supplier updated", () => {});
    it("Request status 200 - Data conflict ", () => {});
    it("Request status 400 - Invalid data type ", () => {});
});
describe("Request to ProductController - Delete product", () => {
    it("Request status 200 - Supplier deleted", () => {});
    it("Request status 200 - Supplier not found", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});