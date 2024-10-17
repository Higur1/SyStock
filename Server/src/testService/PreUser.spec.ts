import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import PreUser from "../models/PreUser";
import preUser from "../service/PreUserService";

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
    it("Should be able to delete a preUser", async () => {
        const preUserData: PreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };
        
        preUserData.id = (await preUser.findPreUser(preUserData)).preuser?.id;
        const preUserExcluded = await preUser.delete(preUserData);

        expect(preUserExcluded.status).toBe(true);
    }),
     afterAll( async () =>{
        await preUser.deleteAll();
     });
});