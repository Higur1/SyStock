import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import User from "../models/User";
import user from "../service/UserService";
import PreUser from "../models/PreUser";
import preUser from "../service/PreUserService";

describe("Create user model", () => {

    let userEmail;
    let userLogin;

    beforeAll(() => {
        const genarateUniqueEmail = `Mock UserEmail-${String(Date.now())}`;
        userEmail = genarateUniqueEmail;
        const genarateUniqueLogin = `Mock UserLogin-${String(Date.now())}`;
        userLogin = genarateUniqueLogin;
    });

    it("Should be able to create a new user", async () => {
        const preUserData: PreUser = {
            name: "Higor",
            email: userEmail
        };

        const preUserCreated = await preUser.create(preUserData);

        const userData: User = {
            name: "Higor",
            login: userLogin,
            password: "higor",
            email: userEmail,
            excludedStatus: false
        };

        const createUser = await user.createEmployee(userData);

        preUserData.id = preUserCreated.preuser?.id;
        await preUser.delete(preUserData);

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
    it("Should be able to delete a user", async () => {

        const userData: User = {
            name: "Higor",
            login: userLogin,
            password: "higor",
            email: userEmail,
            excludedStatus: false
        };

        userData.id = await (await user.findEmail(userData)).user?.id

        const userExcluded = await user.deleteFuncionario(userData);

        expect(userExcluded.status).toBe(true);
    });

    afterAll(async () => {
        await preUser.deleteAll();
        await user.deleteAllEmployees();
    });
});