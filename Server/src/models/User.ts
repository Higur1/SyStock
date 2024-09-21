import { prisma } from "../config/prisma";

export default class User {
  static async findAll() {
    try {
      const listUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          login: true,
        },
      });
      return listUsers.length > 0
        ? { status: true, listUsers }
        : { status: true, listUsers: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(name, user_login, hash_password, email, user_type_id) {
    try {
      const pre_User = await prisma.pre_User.findFirst({
        where: {
          AND: [{ name: name }, { email: email }],
        },
      });
      if (pre_User != undefined) {
        const user = await prisma.user.create({
          data: {
            name: name,
            login: user_login,
            password: hash_password,
            email: email,
            user_type: user_type_id,
          },
        });
        return {
          status: true,
          user: {
            name: user.name,
            user_login: user.login,
            email: user.email,
          },
        };
      } else {
        return {
          status: false,
          error: "preuser don't exists"
        };
      }
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findEmail(email) {
    try {
      const user = await prisma.user.findFirst({ where: { email } });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findUser(email, login) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { login: login }],
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findNameStartWith(name) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: {
            startsWith: name,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type_id: true,
        },
      });
      return user != undefined
        ? { status: true, user: user }
        : { status: true, user: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findName(name) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: name,
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type_id: true,
        },
      });
      return user != undefined
        ? { status: true, exists: true }
        : { status: true, exists: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findUserById(id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findUserByTypeId(user_type) {
    try {
      const listOfUsers = await prisma.user.findMany({
        where: {
          user_type_id: user_type,
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type_id: true,
        },
      });
      return listOfUsers != null
        ? { status: true, listOfUsers: listOfUsers }
        : { status: true, listOfUsers: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async update(id, name, type_id) {
    try {
      const result = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          user_type_id: type_id,
        },
      });
      return result != null
        ? {
            status: true,
            userUpdated: {
              id: result.id,
              name: result.name,
              login: result.user_login,
              created: result.createdAt,
            },
          }
        : { status: true, userUpdated: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(id) {
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async authUser(user_login) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          user_login: user_login,
        },
      });
      return user
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async listOfUsersOfCompany(user_type_id) {
    try {
      const userList = await prisma.user.findMany({
        where: { user_type_id: user_type_id },
      });
      return userList.length > 0
        ? { status: true, userList: userList }
        : { status: true, userList: [] };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async tokenCreate(user: any) {
    try {
      const result = await prisma.token_Recovery.create({
        data: {
          user_id: user.id,
        },
      });
      return result != null
        ? { status: true, result: result.id }
        : { status: true, result: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async tokenValited(token) {
    try {
      const tokenIsValid = await prisma.token_Recovery.findUnique({
        where: {
          id: token,
        },
      });
      return tokenIsValid == undefined
        ? { status: true, isValid: false }
        : {
            status: true,
            isValid: true,
            token: { id: tokenIsValid.id, user_id: tokenIsValid.user_id },
          };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async tokenDelete(user_id) {
    try {
      const result = await prisma.token_Recovery.deleteMany({
        where: {
          user_id: user_id,
        },
      });
      return result.count > 0 ? { status: true } : { status: false };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async updatePassword(id, password) {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          user_password: password,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
