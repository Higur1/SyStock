import PreUser from "../models/PreUser";
import preUserService from "../service/PreUserService"
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
export default class PreUserController {
  static async listOfPreUsers(request, response) {
    try {
      const listOfPreUsers = await preUserService.findAll();

      if (listOfPreUsers.status) {
        response.status(200).send(
          JSON.stringify({
            preusers: listOfPreUsers.listPreUsers,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            error: listOfPreUsers.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error,
        })
      );
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

      const preUserData: PreUser = {
        name: name,
        email: email
      };

      const preuserExists = await preUserService.findPreUser(preUserData);
     
      if (preuserExists.status && preuserExists.preuser == undefined) {
          const preUserCreate = await preUserService.create(preUserData)
          response.status(201).send(JSON.stringify({PreUser: preUserCreate.preuser}));
      } else {
        response.status(200).send(
          JSON.stringify({
            message:
              "an operation could not be performed email already exists",
            error: preuserExists.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          Error: error.issues[0].message,
        })
      );
    }
  }
}
