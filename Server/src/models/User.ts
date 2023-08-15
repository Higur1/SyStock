import { prisma } from "../config/prisma";

export default class User {
  static async findAll(company_id) {
    try {
      const listUsers = await prisma.user.findMany({
        where: {
          company_id: company_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_login: true,
          user_type_id: true,
        },
      });
      return listUsers.length > 0
        ? { status: true, listUsers }
        : { status: true, listUsers: {} };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async create(
    name,
    user_login,
    hash_password,
    email,
    user_type_id,
    company_id
  ) {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          user_login,
          user_password: hash_password,
          email,
          user_type_id,
          company_id,
        },
      });
      return {
        status: true,
        user: {
          name: user.name,
          user_login: user.user_login,
          email: user.email,
          company_id: user.company_id,
        },
      };
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
          OR: [{ email: email }, { user_login: login }],
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findNameStartWith(name, company_id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: {
            startsWith: name,
          },
          company_id: company_id,
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
  static async findName(name, company_id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: name,
          company_id: company_id,
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
  static async findUserById(id, company_id) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: id,
          company_id: company_id,
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async findUserByTypeId(user_type, company_id) {
    try {
      const listOfUsers = await prisma.user.findMany({
        where: {
          user_type_id: user_type,
          company_id: company_id,
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
              company: result.company_id,
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
  static async verifyTypeOfPlanCompany(company_id) {
    try {
      const type_plan = await prisma.company.findFirst({
        where: {
          id: company_id,
        },
        select: {
          subscription_plans: true,
        },
      });
      return { status: true, type: type_plan };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async listOfUsersOfCompany(company_id, user_type_id) {
    try {
      const userList = await prisma.user.findMany({
        where: { company_id: company_id, user_type_id: user_type_id },
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
          company_id: user.company_id,
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
