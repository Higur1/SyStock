import userService from "../service/UserService";
import User from "../models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../functions/nodemailer";

export default class LoginController {
  static async auth(request, response) {
    try {
      const userValidation = z.object({
        user_login: z
          .string()
          .trim()
          .min(5, "user_login required minimum 5 character(s)")
          .max(10, "user_login required maximum 10 character(s)"),
        user_password: z
          .string()
          .trim()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
      });
      const { user_login, user_password } = userValidation.parse(request.body);

      const userData: User = {
        email: "",
        login: user_login,
        name: "",
        password: user_password,
      }

      const userVerify = await userService.authUser(userData);
      if (userVerify.status) {
        if (userVerify.user != undefined) {
          await bcrypt
            .compare(user_password, userVerify.user.password)
            .then(async (checkPassword) => {
              if (!checkPassword) {
                return response.status(401).send({ Message: "Incorrect login or password" });
              } else {
                const knowkey = process.env.JWTSecret;
                const token = jwt.sign(
                  {
                    id: userVerify.user.id,
                    email: userVerify.user.email,
                    user_type: userVerify.user.user_type
                  },
                  knowkey!,
                  { expiresIn: "24h" }
                );
               // const _links = generatorHATEOAS(userVerify.user);
                response.status(200).send(
                  JSON.stringify({
                    token: token,
                  //  _links,
                  })
                );
              }
            });
        } else {
          response.status(404).send(
            JSON.stringify({
              message: "User not found",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            Error: userVerify.error,
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
  static async recovery(request, response) {
    try {
      const recovery = z.object({
        email: z.string().trim().email("Valid email required"),
        instance: z.string(),
      });

      const { email, instance } = recovery.parse(request.body);
      const userData: User = {
        email: email,
        login: "",
        name: "",
        password: "",
      }
      
      const userResult = await userService.findByEmail(userData);

      if (userResult.status) {
        if (userResult.user != undefined) {
          const tokenRecovery = await userService.tokenCreate(userResult.user.id);
          sendEmail(email, tokenRecovery!.result, instance);
          response.status(200).send(
            JSON.stringify({
              Message: "Email sent",
            })
          );
        } else {
          response.status(404).send(
            JSON.stringify({
              Message: "Email not found",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            Error: userResult.error,
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
