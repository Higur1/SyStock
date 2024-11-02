import IPreUser from "../interface/IPreUser";
import PreUserService from "../service/PreUserService";
import { z } from "zod";

export default class PreUserController {
    static async list(request, response) {
        try {
            const list = await PreUserService.list();

            response.status(200).send(JSON.stringify({
                Pre_Users: list
            }));
        } catch (error) {
            if (error.message === "An error has occurred") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
    static async create(request, response) {
        try {
            const preUserValidation = z.object({
                name: z
                  .string()
                  .trim()
                  .min(5, "Name required minimum 5 character(s)")
                  .max(20, "Name required Maximum 20 character(s)"),
                email: z.string().email("Valid e-mail required").trim(),
              });
              const { name, email } = preUserValidation.parse(request.body);
        
              const preUserData: IPreUser = {
                name: name,
                email: email
              };

            const createResult = await PreUserService.create(preUserData);

            response.status(201).send(JSON.stringify({
                Pre_User: createResult.preuser
            }));
        } catch (error) {
            if(error.message === "An operation could not be performed. Email already used"){
                response.status(409).send(JSON.stringify({
                    Error: error.message
                }));
            }
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message,
            }));
        }
    }
}
