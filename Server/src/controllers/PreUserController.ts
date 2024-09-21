import { error } from "console";
import PreUser from "../models/PreUser";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
export default class PreUserController {
  static async listOfPreUsers(request, response) {
    try {
      const listOfPreUsers = await PreUser.findAll();

      if (listOfPreUsers.status) {
        response.status(200).send(
          JSON.stringify({
            preusers: listOfPreUsers.listPreUsers,
          })
        );
      } else {
        response.status().send(
          JSON.stringify({
            error: listOfPreUsers.error,
          })
        );
      }
    } catch (error) {
      response.status(500).send(
        JSON.stringify({
          error: error,
        })
      );
    }
  }
  static async create(request, response) {
    try {
      const preUser = z.object({
        name: z
          .string()
          .trim()
          .min(5, "Name required minimum 5 character(s)")
          .max(20, "Name required Maximum 20 character(s)"),
        email: z.string().email("Valid e-mail required").trim(),
      });
      const { name, email } = preUser.parse(request.body);

      const preuserExists = await PreUser.findPreUser(email);

      if (preuserExists.status && preuserExists.preuser == undefined) {
        await PreUser.create(name, email).then((preUser) => {
          response.status(201).send(preUser.preuser);
        });
      } else {
        response.status(409).send(
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
          error: error.issues[0].message,
        })
      );
    }
  }
}
