import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import PreUser from "../entities/PreUser";
import preUser from "../models/PreUser";

describe("Create preUser model", () => {
    it("Should be able to create a new preUser", async () => {
        const preUserData: PreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };
        const createPreUser = await preUser.create(preUserData);

        expect(createPreUser).toHaveProperty("preuser.id");
     });
     it("Should not be able to create a new preUser", async () => {
        const preUserData: PreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };

        const createPreUser = await preUser.create(preUserData);

        expect(createPreUser).toHaveProperty("message");

     });
     afterAll( async () =>{
        await preUser.delete();
     });
});