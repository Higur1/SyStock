import userService from "../service/UserService";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User";
import { uptime } from "process";

dotenv.config();

export default class UserController {
  static async list(request, response) {
    try {
      const listOfUsers = await userService.findAll();

      if (listOfUsers.status) {
        const _links = generatorHATEOAS("");

        response
          .status(200)
          .send(JSON.stringify({ Users: listOfUsers.listUsers, _links }));
      } else {
        response.status(500).send(
          JSON.stringify({
            Message: "An error has occured",
            error: listOfUsers.error,
          })
        );
      }
    } catch (error) {
      response
        .status(400)
        .send(
          JSON.stringify({ Message: "An error has occurred", error: error })
        );
    }
  };
  static async findByName(request, response) {
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

      const userList = await userService.findByNameStartWith(userData);
      if (userList.status) {
        if (userList.user != undefined) {
          response.status(200).send(
            JSON.stringify({
              Users: userList.user,
            })
          );
        } else {
          response.status(404).send(
            JSON.stringify({
              Users: userList.user
            })
          );
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            Message: "An error has occured",
            error: userList.error,
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
  static async find(request, response) {
    try {
      const userValidation = z.object({
        id: z.string().min(1)
      });
      const { id } = userValidation.parse(request.params);
    
      const userData: User = {
        id: Number(id),
        email: "",
        login: "",
        name: "",
        password: "",
      };
      const userResult = await userService.find(userData);
      if (userResult.status) {
        if (userResult.user != undefined) {
          response.status(200).send(
            JSON.stringify({
              User: userResult.user
            })
          )
        } else {
          response.status(404).send(
            JSON.stringify({
              Message: "User not found"
            })
          )
        };
      } else {
        response.status(500).send(
          JSON.stringify({
            Message: "An error has occured",
            Error: userResult.error,
          })
        );
      };
    } catch (error) {
      response.status(400).send(
        JSON.stringify({
          Error: error,
        })
      );
    };
  }
  static async create(request, response) {
    try {
      const userValidation = z.object({
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
        password: z
          .string()
          .trim()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
        email: z.string().email("Valid e-mail required").trim(),
      });
      const { name, login, password, email } = userValidation.parse(
        request.body
      );
      const hash_password = cryptPassword(password);

      const userData: User = {
        email: email,
        login: login,
        name: name,
        password: hash_password,
      }

      const user_create = await userService.create(userData);
      console.log(user_create)
      if (user_create.pre_user_exists == false) {
        response.status(404).send(
          JSON.stringify({
            message: "Pre_user not found",
          })
        );
      };
      if (user_create.user_alredy_exists) {
        response.status(409).send(
          JSON.stringify({
            Message: "Email alredy used"
          }));
      };
      if (user_create.status && user_create.user != undefined) {
        response.status(201).send(user_create.user);
      } else {
        response.status(500).send(
          JSON.stringify({
            Error: user_create.error,
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
  };
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

      const updatedUser = await userService.update(userData);

      if (updatedUser.user_name_already_exists) {
        response.status(409).send(
          JSON.stringify({
            Message: "Name already exists",
          })
        );
      };
      if (updatedUser.user_dont_exists) {
        response.status(404).send(
          JSON.stringify({
            Message: "User not found"
          })
        )
      }
      if (updatedUser.status && updatedUser.userUpdated) {
        response.status(200).send(
          JSON.stringify({
            User: updatedUser.userUpdated
          })
        )
      } else {
        response.status(500).send(
          JSON.stringify({
            error: updatedUser.error,
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
        newEmail: z.string().email("Valid e-mail required").trim(),
      });

      const { id, newEmail } = dataUser.parse(request.body);

      const userData: User = {
        id: id,
        email: newEmail,
        login: "",
        name: "",
        password: "",
      }

      const userUpdated = await userService.update(userData);
      if (userUpdated.user_email_already_exists) {
        response.status(409).send(
          JSON.stringify({
            Error: "Email already used",
          })
        );
      };
      if (userUpdated.status) {
        if (userUpdated.userUpdated) {
          response.status(200).send(
            JSON.stringify({
              User: userUpdated.userUpdated
            })
          )
        } else {
          response.status(404).send(
            JSON.stringify({
              Message: "User not found"
            })
          )
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            Error: userUpdated.error
          })
        )
      }
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
        newPassword: z
          .string()
          .trim()
          .min(5, "user_password required minimum 5 character(s)")
          .max(10, "user_password required maximum 10 character(s)"),
      });

      const { id, newPassword } = userValidation.parse(request.body);

      const userData: User = {
        id: id,
        email: "",
        login: "",
        name: "",
        password: newPassword,
      }
      const userFind = await userService.find(userData);

      if (userFind.status) {
        if (userFind.user != undefined) {
          const hash_password = cryptPassword(newPassword);

          await userService.updatePassword_editUser(id, hash_password).then(
            response.status(200)
          );
        }
        response.status(404).send(
          JSON.stringify({
            error: "User not found",
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
  static async delete(request, response) {
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
      const userResult = await userService.find(userData);
      if (userResult.status) {
        if (userResult.user != undefined) {
          if (userResult.user.id != 1) {
            await userService.tokenDelete(userResult.user.id);
            await userService.delete(userResult.user.id);
            response.status(200).send(
              JSON.stringify({
                Message: "User delete successfully"
              })
            )
          } else {
            response.status(400).send(
              JSON.stringify({
                Message: "Is not possible to delete the admin user",
              })
            );
          }
        } else {
          response
            .status(404)
            .send(JSON.stringify({ Message: "User not found" }));
        }
      } else {
        response.status(500).send(
          JSON.stringify({
            error: userResult.error,
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
                message: "Token already used",
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
