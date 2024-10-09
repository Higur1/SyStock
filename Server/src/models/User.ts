import { prisma } from "../config/prisma";
import UserEntity from "../entities/User";
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
    };
  };
  static async findAllFuncionarios() {
    try {
      const listOfFuncionarios = await prisma.user.findMany({
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
      return listOfFuncionarios.length > 0
        ? { status: true, listOfFuncionarios }
        : { status: true, listOfFuncionarios: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async createEmployee(userData: UserEntity) {
    try {
      const verifyUserExists = await User.findUser(userData);
      if (verifyUserExists.user == undefined) {
        const pre_User = await prisma.pre_User.findFirst({
          where: {
            AND: [{ name: userData.name }, { email: userData.email }],
          },
        });
        if (pre_User != undefined) {
          const userResult = await prisma.user.create({
            data: {
              name: userData.name,
              login: userData.login,
              password: userData.password,
              email: userData.email,
              excludedStatus: false,
              user_type: 2,
            },
          });
          return {
            status: true,
            user: {
              id: userResult.id,
              name: userResult.name,
              user_login: userResult.login,
              email: userResult.email,
            },
          };
        } else {
          return {
            status: false,
            message: "preuser don't exists",
          };
        };
      } else {
        return { status: true, message: "User alredy exists" }
      };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findEmail(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({ where: { email: userData.email } });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findUser(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { login: userData.login }],
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findNameStartWith(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: {
            startsWith: userData.name,
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
    };
  };
  static async findName(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: userData.name,
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
    };
  };
  static async findUserById(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userData.id,
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findUserByTypeId(userData: UserEntity) {
    try {
      const listOfUsers = await prisma.user.findMany({
        where: {
          user_type: 2,
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
    };
  };
  static async update(userData: UserEntity) {
    try {
      const result = await prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          name: userData.name,
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
    };
  };
  static async updateEmail(userData: UserEntity) {
    try {
      const result = await prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          email: userData.email,
        },
      });
      return result != null
        ? {
          status: true,
        }
        : { status: false };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async deleteFuncionario(userData: UserEntity) {
    try {
      await prisma.user.delete({
        where: { id: userData.id },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async authUser(userData: UserEntity) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          login: userData.login,
        },
      });
      return user
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };

  static async tokenCreate(userData: UserEntity) {
    try {
      if(userData.id != undefined){
        const result = await prisma.token_Recovery.create({
          data: {
            user_id: userData.id,
            status: true,
          },
        });
        return result != null
          ? { status: true, result: result.token }
          : { status: true, result: undefined };
      }
    } catch (error) {
      return { status: false, error: error };
    };
  };
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
    };
  };
  static async tokenDelete(userData: UserEntity) {
    try {
      const result = await prisma.token_Recovery.deleteMany({
        where: {
          user_id: userData.id,
        },
      });
      return result.count > 0 ? { status: true } : { status: false };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async updatePassword_editUser(id, password) {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: password,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async updatePassword_resetPassword(id, token, password) {
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
    };
  };
  static async isFuncionario(id) {
    const user = await prisma.user.findFirst({ where: { id: id } });
    return user?.user_type == 2 ? { is: true } : { is: false };
  };
};
