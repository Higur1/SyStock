import { describe, it, expect, beforeAll, afterAll, jest, beforeEach } from "@jest/globals";


describe("Request to userController - ListOfUsers", () => {
    it("Request status 200 - List of users", () => {

    });
    it("Request status 200 - Empty List", () => {

    });
    it("Request status 500 - An error has ocurred - Invalid data type", () => {

    });
    it("Request status 500 - An error has occured - Internal error", () => {

    });
});
describe("Request to userController - listOfAllEmployees", () => {
    it("Request status 200 - Ok", () => {

    });
    it("Request status 200 - Empty list", () => {

    });
    it("Request status 500 - An error has ocurred - Internal error", () => {

    });
    it("Request status 400 - An error has ocurred - Invalid data type", () => {

    });
});
describe("Request to userController - findUserByName", () => {
    it("Request status 200 - Find user startWith", () => {

    });
    it("Request status 200 - Find user empty list", () => {

    });
    it("Request status 500 - An error has ocurred - Internal error", () => {

    });
    it("Request status 400 - An error has ocurred - Invalid data type", () => {

    });
});
describe("Request to userController - findUserByTypeId", () => {
    it("Request status 200 - List of users by type id", () => { });
    it("Request status 200 - Empty list of users by type id", () => { });
    it("Request status 500 - Internal Error", () => { });
    it("Request status 400 - Invalid data type", () => { });
});
describe("Request to userController - Create user employee", () => {
    it("Request status 201 - User created", () => { });
    it("Request status 200 - PreUser required don't exists ", () => { });
    it("Request status 500 - Internal error", () => { });
    it("Request status 200 - Email alredy registered", () => { });
    it("Request status 400 - Invalid data type", () => { });
});
describe("Request to userController - Edit user", () => {
    it("Request status 200 - User alredy exists", () => { });
    it("Request status 200 - User updated", () => { });
    it("Request status 200 - User don't exists ", () => { });
    it("Request status 500 - Internal error", () => { });
    it("Request status 400 - Invalid data type", () => { });
});
describe("Request to userController - Edit email", () => {
    it("Request status 200 - Email alredy used", () => { });
    it("Request status 200 - Email changed", () => { });
    it("Request status 200 - User don't exists", () => { });
    it("Request status 500 - Internal error", () => { });
    it("Request status 400 - Invalid data type", () => { });
});
describe("Request to userController - Edit password", () => {
    it("Request status 200 - User password updated", () => { });
    it("Request status 200 - User don't exists", () => { });
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to userController - Delete employee", () => {
    it("Request status 200 - Employee deleted", () => {});
    it("Request status 200 - Isn't possible deleted the admin user", () => {});
    it("Request status 200 - User don't exists", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
describe("Request to userController - Reset password", () => {
    it("Request status 200 - User password reseted", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 200 - Token alredy used", () => {});
    it("Request status 200 - Token invalid", () => {});
    it("Request status 500 - Internal error", () => {});
    it("Request status 400 - Invalid data type", () => {});
});
