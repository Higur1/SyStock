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
        where: {
          excludedStatus: false,
        },
      });
      return listUsers.length > 0
        ? { status: true, listUsers }
        : { status: true, listUsers: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findAllUserFuncionarioType() {
    try {
      const listUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          login: true,
        },
        where: {
          excludedStatus: false,
          user_type: 2,
        },
      });
      return listUsers.length > 0
        ? { status: true, listUsers }
        : { status: true, listUsers: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async createFuncionario(name, user_login, hash_password, email) {
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
            excludedStatus: false,
            user_type: 2,
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
          error: "preuser não existe",
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
          user_type: true,
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
          user_type: true,
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
          user_type: user_type,
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type: true,
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
          user_type: type_id,
        },
      });
      return result != null
        ? {
            status: true,
            userUpdated: {
              id: result.id,
              name: result.name,
              login: result.login,
              created: result.createdAt,
            },
          }
        : { status: true, userUpdated: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async deleteFuncionario(id) {
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
          login: user_login,
        },
      });
      return user
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  static async tokenCreate(user: any) {
    try {
      const result = await prisma.token_Recovery.create({
        data: {
          user_id: user.id,
          status: true,
        },
      });
      return result != null
        ? { status: true, result: result.token }
        : { status: true, result: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async tokenValited(token) {
    try {
      const tokenIsValid = await prisma.token_Recovery.findUnique({
        where: {
          token: token,
        },
      });
      const teste = await prisma.token_Recovery.findMany();
      return tokenIsValid == undefined
        ? { status: true, isValid: false }
        : {
            status: true,
            isValid: true,
            token: { id: tokenIsValid.token, user_id: tokenIsValid.user_id },
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
  static async updatePassword(id, token, password) {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: password,
        },
      });
      await prisma.token_Recovery.update({
        where: {
          token: token,
        },
        data: {
          status: false,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async isFuncionario(id) {
    const user = await prisma.user.findFirst({ where: { id: id } });
    return user?.user_type == 2 ? { is: true } : { is: false };
  }
}
