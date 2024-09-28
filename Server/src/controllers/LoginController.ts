import User from "../models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../functions/nodemailer";

export default class LoginController {
  static async auth(request, response) {
    try {
      const user = z.object({
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
      const { user_login, user_password } = user.parse(request.body);

      const userVerify = await User.authUser(user_login);
      if (userVerify.status) {
        if (userVerify.user != undefined) {
          await bcrypt
            .compare(user_password, userVerify.user.password)
            .then(async (checkPassword) => {
              if (!checkPassword) {
                return response.status(401).send({ message: "login ou senha incorretos" });
              } else {
                const knowkey = process.env.JWTSecret;
                const token = jwt.sign(
                  {
                    id: userVerify.user.id,
                    email: userVerify.user.email,
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
              message: "Usuário não existe",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: userVerify.error,
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
  static async recovery(request, response) {
    try {
      const recovery = z.object({
        email: z.string().trim().email("valid email required"),
        instance: z.string(),
      });

      const { email, instance } = recovery.parse(request.body);
      console.log(email);
      console.log(instance);

      const user = await User.findEmail(email);
      console.log(user);
      if (user.status) {
        if (user.user != undefined) {
          console.log("entrou aq");
          const tokenRecovery = await User.tokenCreate(user.user);
          console.log(email);
          console.log(tokenRecovery.result);
          sendEmail(email, tokenRecovery.result, instance);
          response.status(200).send(
            JSON.stringify({
              message: "E-mail sent",
            })
          );
        } else {
          response.status(404).send(
            JSON.stringify({
              message: "Not Found",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: user.error,
          })
        );
      }
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          path: error.issues[0].path,
          error: error.issues[0].message,
          //          error: error.issues[0].message,
        })
      );
    }
  }
}
