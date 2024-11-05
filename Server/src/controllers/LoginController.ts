import IUser from "../interface/IUser";
import LoginService from "../service/LoginService";
import z from "zod"
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

      const userData: IUser = {
        email: "",
        login: user_login,
        name: "",
        password: user_password,
      };

      const token = await LoginService.auth(userData);
 
      response.status(200).send(JSON.stringify({
        token: token
      }));
    } catch (error) {
      if (error.message === "User not found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Incorrect login or password") {
        return response.status(401).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
  static async recovery(request, response) {
    try {
      const recovery = z.object({
        email: z.string().trim().email("Valid email required"),
        instance: z.string(),
      });

      const { email, instance } = recovery.parse(request.body);
      const userData: IUser = {
        email: email,
        login: "",
        name: "",
        password: "",
      };
      await LoginService.recovery(userData, instance);

      response.status(200).send(JSON.stringify({
        Message: "Email sent"
      }));
    } catch (error) {
      if (error.message === "Email not found") {
        return response.status(404).send(JSON.stringify({
          Message: error.message
        }));
      };
      if (error.message === "Internal Server Error") {
        return response.status(500).send(JSON.stringify({
          Error: error.message
        }));
      };
      response.status(400).send(JSON.stringify({
        Error: error.issues[0].message,
      }));
    };
  };
};