import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import User from "../models/User";
import user from "../service/UserService";
import PreUser from "../models/PreUser";
import preUser from "../service/PreUserService";

describe("Create user model", () => {

    let userEmail;
    let userLogin;
    beforeAll(() => {
        const genarateUniqueEmail= `Mock UserEmail-${String(Date.now())}`;
        userEmail = genarateUniqueEmail;
        const genarateUniqueLogin= `Mock UserLogin-${String(Date.now())}`;
        userLogin = genarateUniqueLogin;
    });

    it("Should be able to create a new user", async () => {
        const preUserData: PreUser = {
            name: "Higor",
            email: userEmail
        };

        await preUser.create(preUserData);

        const userData: User = {
            name: "Higor",
            login: userLogin,
            password: "higor",
            email: userEmail,   
            excludedStatus: false
        };

        const createUser = await user.createEmployee(userData);
        await preUser.delete();

        expect(createUser).toHaveProperty("user.id");
    });
    it("Should be no able to create a new user", async () => {
        const preUserData: PreUser = {
            name: "Higor",
            email: userEmail
        };

        await preUser.create(preUserData);

        const userData: User = {
            name: "Higor",
            login: userLogin,
            password: "higor",
            email: userEmail,   
            excludedStatus: false
        };
        const createUser = await user.createEmployee(userData); 

        expect(createUser).toHaveProperty("message");
    });

    afterAll(async () => {
        await preUser.delete();
    });
});