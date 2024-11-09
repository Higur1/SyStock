import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import IPreUser from "../interface/IPreUser";
import PreUserService from "../service/PreUserService";
import {prisma} from "../config/prisma" 

describe("Create preUser model", () => {
    it("Should be able to create a new preUser", async () => {
        const preUserData: IPreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };
        const createPreUser = await PreUserService.create(preUserData);

        expect(createPreUser).toHaveProperty("preuser.id");
     });

     it("Should not be able to create a new preUser", async () => {
        const preUserData: IPreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };

        const createPreUser = await PreUserService.create(preUserData);

        expect(createPreUser).toHaveProperty("message");
     });
     
    it("Should be able to delete a preUser", async () => {
        const preUserData: IPreUser = {
            name: "Teste",
            email: "Higor.hungria466@gmail.com"
        };
        
        preUserData.id = (await PreUserService.find(preUserData)).preuser?.id;
        const preUserExcluded = await PreUserService.delete(preUserData);
        console.log(preUserExcluded)
        expect(preUserExcluded.status).toBe(true);
    }),
     afterAll( async () =>{
        await prisma.pre_User.deleteMany({});
     });
});