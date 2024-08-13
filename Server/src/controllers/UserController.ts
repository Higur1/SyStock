import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendEmail } from "../functions/nodemailer";

dotenv.config();

export default class UserController {
  static async listOfUsers(request, response) {
    try {
      const listOfUsers = await User.findAll();

      if (listOfUsers.status) {
        const _links = generatorHATEOAS("");

        response
          .status(200)
          .send(JSON.stringify({ users: listOfUsers.listUsers, _links }));
      } else {
        response.status(500).send(
          JSON.stringify({
            message: "An error has occured",
            error: listOfUsers.error,
          })
        );
      }
    } catch (error) {
      response
        .status(400)
        .send(
          JSON.stringify({ message: "An error has occurred", error: error })
        );
    }
  }
  static async create(request, response) {
    try {
      const user = z.object({
        name: z
          .string()
          .trim()
          .min(5, "Name required minimum 5 character(s)")
          .max(20, "Name required Maximum 20 character(s)"),
        user_login: z
          .string()
          .trim()
          .min(5, "user_login required minimum 5 character(s)")
          .trim()
          .max(10, "user_login required maximum 10 character(s)")
          .trim(),
        user_password: z
          .string()
          .trim()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
        email: z.string().email("Valid e-mail required").trim(),
        user_type_id: z.number().gt(0),
      });
      const {
        name,
        user_login,
        user_password,
        email,
        user_type_id,
      } = user.parse(request.body);

      const userExists = await User.findUser(email, user_login);
      const hash_password = cryptPassword(user_password);

      if (userExists.status && userExists.user == undefined){
          await User.create(
            name,
            user_login,
            hash_password,
            email,
            user_type_id,
          ).then((user) => {
            response.status(201).send(user.user);
          });
        } 
      else {
        response.status(409).send(
          JSON.stringify({
            message:
              "an operation could not be performed email or login already exists",
            error: userExists.error,
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
  static async findUserByName(request, response) {
    try {
      const user = z.object({
        name: z
          .string()
          .trim()
          .min(1, "Name required minimum 1 character(s)")
          .max(20, "Name required maximum 20 character(s)"),
      });
      const { name } = user.parse(request.params);
      const token = request.headers.authorization;
    
      const userList = await User.findNameStartWith(name);
      if (userList.status) {
        if (userList.user != undefined) {
          response.status(200).send(
            JSON.stringify({
              users: userList.user,
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
            message: "An error has occured",
            error: userList.error,
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
  static async findUserByTypeId(request, response) {
    try {
      const user = z.object({
        type_id: z
          .string()
          .trim()
          .min(1, "type_id required minimum 1 character(s)")
          .max(1, "type_id required maximum 1 character(s)"),
      });
      const { type_id } = user.parse(request.params);
      const listOfUsers = await User.findUserByTypeId(
        Number(type_id)
      );

      if (listOfUsers.status) {
        if (listOfUsers.listOfUsers != undefined) {
          response.status(200).send(
            JSON.stringify({
              users: listOfUsers.listOfUsers,
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
            error: listOfUsers.error,
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
  static async edit(request, response) {
    try {
      const user = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
        name: z
          .string()
          .trim()
          .min(3, "Name required minimum 3 character(s)")
          .max(20, "Name required maximum 20 character(s)"),
        user_type_id: z
          .number()
          .min(1, "type_id required minimum 1 character(s)")
          .max(3),
      });
      const { id, name, user_type_id } = user.parse(request.body);
      const userFind = await User.findUserById(id);
      const userNameExists = await User.findName(name);

      if (userFind.status) {
        if (userNameExists.exists) {
          response.status(200).send(
            JSON.stringify({
              message: "Name already exists",
            })
          );
        } else if (userFind.user?.user_type_id == 1) {
          await User.update(id, name, 1).then((userResult) => {
            response.status(200).send(
              JSON.stringify({
                user: {
                  id: userResult.userUpdated?.id,
                  name: userResult.userUpdated?.name,
                  login: userResult.userUpdated?.login,
                  created: userResult.userUpdated?.created,
                },
              })
            );
          });
        } else {
          await User.update(id, name, user_type_id).then((userResult) => {
            response.status(200).send(
              JSON.stringify({
                user: {
                  id: userResult.userUpdated?.id,
                  name: userResult.userUpdated?.name,
                  login: userResult.userUpdated?.login,
                  created: userResult.userUpdated?.created,
                },
              })
            );
          });
        } 
      } else {
        response.status(500).send(
          JSON.stringify({
            error: userFind.error,
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
  static async remove(request, response) {
    try {
      const user = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
      });
      const { id } = user.parse(request.body);

      const userId = await User.findUserById(id);
      if (userId.status) {
        if (userId.user != undefined) {
          if (userId.user.user_type_id != 1) {
            await User.tokenDelete(userId.user.id);
            await User.delete(userId.user.id);
            response.status(200);
          } else {
            response.status(401).send(
              JSON.stringify({
                message: "Is not possible to delete the admin user",
              })
            );
          }
        } else {
          response.status(404).send(JSON.stringify({ message: "Not Found" }));
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: userId.error,
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
            .compare(user_password, userVerify.user.user_password)
            .then(async (checkPassword) => {
              if (!checkPassword) {
                return response.status(401).send({ message: "Unauthorized" });
              } else {
                const knowkey = process.env.JWTSecret;
                const token = jwt.sign(
                  {
                    id: userVerify.user.id,
                    email: userVerify.user.email
                  },
                  knowkey!,
                  { expiresIn: "24h" }
                );
                const _links = generatorHATEOAS(userVerify.user);
                response.status(200).send(
                  JSON.stringify({
                    token: token,
                    _links,
                  })
                );
              }
            });
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
        instance: z
          .string()
          .trim()
          .min(10, "instance required 10 character(s)"),
      });
      const { email, instance } = recovery.parse(request.body);

      const user = await User.findEmail(email);
      if (user.status) {
        if (user.user != undefined) {
          const tokenRecovery = await User.tokenCreate(user.user);
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
          error: error.issues[0].message,
        })
      );
    }
  }
  static async resetPassword(request, response) {
    try {
      const passwordReset = z.object({
        token: z
          .string()
          .trim()
          .min(36, "token required minimum 36 character(s)")
          .max(36, "token required maximum 36 character(s)"),
        user_password: z
          .string()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
      });

      const { user_password, token } = passwordReset.parse(request.body);

      const isValidToken = await User.tokenValited(token);
      if (isValidToken.status) {
        if (isValidToken.isValid) {
          if (isValidToken.status) {
            const result = await User.updatePassword(
              isValidToken.token?.user_id,
              user_password
            );
            if (result.status) {
              response.status(200).send(
                JSON.stringify({
                  message: "password updated",
                })
              );
            } else {
              response.status(500).send(
                JSON.stringify({
                  error: result.error,
                })
              );
            }
          } else {
            response.status(401).send(
              JSON.stringify({
                message: "Token alredy used",
              })
            );
          }
        } else {
          response.status(401).send(
            JSON.stringify({
              message: "Token invalid",
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: isValidToken.error,
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
function generatorHATEOAS(user) {
  user =
    user == undefined ? ((user.user_name = " "), (user.user_id = 0)) : user;
  return [
    {
      href: "http://localhost:3333/users",
      method: "GET",
      rel: "list_users",
    },
    {
      href: `http://localhost:3333/user/name/${user.user_name}`,
      method: "GET",
      rel: "info_user_by_name",
    },
    {
      href: `http://localhost:3333/user/${user.user_id}`,
      method: "GET",
      rel: "info_user_by_id",
    },
    {
      href: `http://localhost:3333/users/`,
      method: "GET",
      rel: "info_user_by_type",
    },
    {
      href: `http://localhost:3333/user`,
      method: "PUT",
      rel: "update_user",
    },
    {
      href: `http://localhost:3333/user`,
      method: "DELETE",
      rel: "delete_user",
    },
    {
      href: `http://localhost:3333/auth`,
      method: "POST",
      rel: "auth_user",
    },
    {
      href: `http://localhost:3333/recovery`,
      method: "POST",
      rel: "recovery_password",
    },
    {
      href: `http://localhost:3333/reset/password`,
      method: "PUT",
      rel: "reset_password",
    },
  ];
}

function cryptPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
function genericError(code) {}
export { UserController };
