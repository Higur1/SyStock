import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";

describe("Request to LoginController - Auth", ()=>{
    it("Request status 200 - Auth authorized", () => {});
    it("Request status 200 - User don't exists", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to LoginController - Recovery password", ()=>{
    it("Request status 200 - Email sent", () => {});
    it("Request status 200 - Email not found", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});