import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";

describe("Request to CategoryController - Find all categories", ()=>{
    it("Request status 200 - List of categories", () => {});
    it("Request status 200 - Empty list of categories", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to CategoryController - Create", ()=>{
    it("Request status 201 - Category created", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 200 - Category alredy exists", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to CategoryController - Find by id", ()=>{
    it("Request status 200 - List of categories", () => {});
    it("Request status 200 - Category don't exists", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to CategoryController - Find by name", ()=>{
    it("Request status 200 - List of categories", () => {});
    it("Request status 200 - Category don't exists", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to CategoryController - Edit", ()=>{
    it("Request status 200 - Name of category alredy exists", () => {});
    it("Request status 200 - Category not found", () => {});
    it("Request status 200 - Category updated", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to CategoryController - Delete", ()=>{
    it("Request status 200 - Category deleted", () => {});
    it("Request status 200 - Category not found", () => {});
    it("Request status 200 - is not possible to delete category because have products", () => {});
    it("Request status 400 - Invalid data type", () => {});
});