import userService from "../service/UserService";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User";

dotenv.config();

export default class UserController {
  static async listOfUsers(request, response) {
    try {
      const listOfUsers = await userService.findAll();

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
  static async findAllEmployees(request, response) {
    try {
      const listOfEmployees = await userService.findEmployees();

      if (listOfEmployees.status) {
        const _links = generatorHATEOAS("");

        response.status(200).send(
          JSON.stringify({
            users: listOfEmployees.listOfEmployees,
            _links,
          })
        );
      } else {
        response.status(500).send(
          JSON.stringify({
            message: "An error has occured",
            error: listOfEmployees.error,
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
  static async findUserByName(request, response) {
    try {
      const userValidation = z.object({
        name: z
          .string()
          .trim()
          .min(1, "Name required minimum 1 character(s)")
          .max(20, "Name required maximum 20 character(s)"),
      });
      const { name } = userValidation.parse(request.params);

      const userData: User = {
        email: "",
        login: "",
        name: name,
        password: "",
      }

      const userList = await userService.findNameStartWith(userData);
      if (userList.status) {
        if (userList.user != undefined) {
          response.status(200).send(
            JSON.stringify({
              users: userList.user,
            })
          );
        } else {
          response.status(200).send(
            JSON.stringify({
              users: userList.user
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
  static async createEmployee(request, response) {
    try {
      const employeeValidation = z.object({
        name: z
          .string()
          .trim()
          .min(5, "Name required minimum 5 character(s)")
          .max(20, "Name required Maximum 20 character(s)"),
        login: z
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
      });
      const { name, login, user_password, email } = employeeValidation.parse(
        request.body
      );
      const userData: User = {
        email: email,
        login: login,
        name: name,
        password: user_password,
      }

      //verifica se os dados do funcionario já existem em algum usuario do sistema já existe antes de cadastra-lo
      const userExists = await userService.findUser(userData);

      //verifica se existe um preusuario para o usuario que será cadastrado

      const hash_password = cryptPassword(userData.password);
      if (userExists.status && userExists.user == undefined) {
        const funcionario = new User({
          name,
          login,
          password: hash_password,
          email,
          excludedStatus: false,
        });

        const user_create = await userService.createEmployee(funcionario);
        if (user_create.status) {
          response.status(201).send(user_create.user);
        }
        if (user_create.error == "preuser don't exists") {
          response.status(200).send(
            JSON.stringify({
              message: "preuser don't exists",
            })
          );
        }
        response.status(500).send(
          JSON.stringify({
            error: user_create.error,
          })
        );
      } else {
        response.status(200).send(
          JSON.stringify({
            message: "Email alredy used",
            error: userExists.error,
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
  static async edit(request, response) {
    try {
      const userValidation = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
        name: z
          .string()
          .trim()
          .min(3, "Name required minimum 3 character(s)")
          .max(20, "Name required maximum 20 character(s)"),
      });

      const { id, name } = userValidation.parse(request.body);
      const userData: User = {
        id: id,
        email: "",
        login: "",
        name: name,
        password: "",
      }
      const userFind = await userService.findUserById(userData);

      const userNameExists = await userService.findName(userData);

      if (userNameExists.exists) {
        response.status(200).send(
          JSON.stringify({
            message: "Name already exists",
          })
        );
      }

      if (userFind.status) {
        if (userFind.user != undefined) {
          userFind.user.name = name;
          await userService.update(userFind.user).then((userResult) => {
            response.status(200).send(
              JSON.stringify({
                user: {
                  id: userResult.userUpdated?.id,
                  name: userResult.userUpdated?.name,
                },
              })
            );
          });
        } else {
          response.status(200).send(
            JSON.stringify({
              error: "User don't exists",
            })
          );
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
  static async editEmail(request, response) {
    try {
      const dataUser = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
        novoEmail: z.string().email("Valid e-mail required").trim(),
      });

      const { id, novoEmail } = dataUser.parse(request.body);

      const userData: User = {
        id: id,
        email: novoEmail,
        login: "",
        name: "",
        password: "",
      }

      const userFind = await userService.findUserById(userData);
      if (userFind.status) {
        if (userFind.user != undefined) {
          const emailFind = await userService.findEmail(userFind.user);
          if (emailFind.user != undefined) {
            response.status(200).send(
              JSON.stringify({
                error: "email alredy used",
              })
            );
          }

          userFind.user.email = novoEmail;
          await userService.updateEmail(userFind.user).then((userResult) => {
            response.status(200).send(
              JSON.stringify({
                user: {
                  id: userResult.result?.id,
                  email: userResult.result?.email,
                },
              })
            );
          });
        }
        response.status(200).send(
          JSON.stringify({
            error: "User don't exists",
          })
        );
      }
      response.status(500).send(
        JSON.stringify({
          error: userFind.error,
        })
      );
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.issues[0].message,
        })
      );
    }
  }
  static async editPassword(request, response) {
    try {
      const userValidation = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
        novaPassword: z
          .string()
          .trim()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
      });

      const { id, novaPassword } = userValidation.parse(request.body);

      const userData: User = {
        id: id,
        email: "",
        login: "",
        name: "",
        password: novaPassword,
      }
      const userFind = await userService.findUserById(userData);

      if (userFind.status) {
        if (userFind.user != undefined) {
          const hash_password = cryptPassword(novaPassword);

          await userService.updatePassword_editUser(id, hash_password).then(
            response.status(200)
          );
        }
        response.status(200).send(
          JSON.stringify({
            error: "User don't exists",
          })
        );
      }
      response.status(500).send(
        JSON.stringify({
          error: userFind.error,
        })
      );
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          error: error.issues[0].message,
        })
      );
    }
  }
  static async deleteEmployee(request, response) {
    try {
      const user = z.object({
        id: z.number().min(1, "id required minimum 1 character(s)"),
      });
      const { id } = user.parse(request.body);

      const userData: User = {
        id: id,
        email: "",
        login: "",
        name: "",
        password: "",
      }
      const userId = await userService.findUserById(userData);
      if (userId.status) {
        if (userId.user != undefined) {
          if (userId.user.id != 1) {
            await userService.tokenDelete(userId.user);
            await userService.deleteFuncionario(userId.user);
            response.status(200);
          } else {
            response.status(200).send(
              JSON.stringify({
                message: "Is not possible to delete the admin user",
              })
            );
          }
        } else {
          response
            .status(200)
            .send(JSON.stringify({ message: "User don't exists" }));
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

      const isValidToken = await userService.tokenValited(token);

      if (isValidToken.status) {
        if (isValidToken.isValid) {
          if (isValidToken.status) {
            const result = await userService.updatePassword_resetPassword(
              isValidToken.token?.user_id,
              isValidToken.token?.id,
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
            response.status(200).send(
              JSON.stringify({
                message: "Token alredy used",
              })
            );
          }
        } else {
          response.status(200).send(
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
          error: error,
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

export { UserController, cryptPassword };
