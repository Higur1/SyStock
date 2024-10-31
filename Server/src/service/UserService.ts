import { prisma } from "../config/prisma";
import User from "../models/User";
export default class UserService {
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
  };
  static async create(userData: User) {
    try {
      const verifyUserExists = await this.find(userData);
     
      if (verifyUserExists.user == undefined) {

        //verify if pre_user exists
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
              excludedStatus:
                userData.excludedStatus = false,
              user_type: 2,
            },
          });
          return {
            status: true,
            user: {
              id: userResult.id,
              name: userResult.name,
              login: userResult.login,
              email: userResult.email
            },
          };
        } else {
          return {
            status: true,
            pre_user_exists: false
          };
        }
      } else {
        return { status: true, user_alredy_exists: true};
      }
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async find(userData: User) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [
            {
              OR: [
                {id: userData.id}, {email: userData.email}
              ]
            },
            {
              excludedStatus: false
            }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type: true,
        },
      });
      return user != null
        ? { status: true, user: user }
        : { status: true, user: undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findByEmail(userData: User) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [
            { email: userData.email },
            { excludedStatus: false }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type: true,
        },
      });
      return user != null
        ? { status: true, exists: true, user: user }
        : { status: true, exists: false, user: undefined};
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findByName(userData: User) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [
            { name: userData.name, },
            { excludedStatus: false }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          user_type: true,
        },
      });
      return user != undefined
        ? { status: true, exists: true, user: user }
        : { status: true, exists: false, user:undefined };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async findByNameStartWith(userData: User) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [
            {
              name: {
                startsWith: userData.name,
              }
            },
            { excludedStatus: false }
          ]
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
  };
  static async update(userData: User) {
    try {
      const findByName = await this.findByName(userData);
      const findByEmail = await this.findByEmail(userData);

      if(!findByName.exists){
        if(!findByEmail.exists){
          const result = await prisma.user.update({
            where: {
              id: userData.id,
            },
            data: {
              ...(userData.name && {name: userData.name}),
              ...(userData.email && {email: userData.email})
            },
          });
          return result != null
            ? {
              status: true,
              userUpdated: {
                id: result.id,
                name: result.name,
                email: result.email,
                created: result.createdAt,
              },
            }
            : { status: true, user_dont_exists: true };
        }else{
          return {status: true, user_email_already_exists: true}
        }
      }else{
        return {status: true, user_name_already_exists: true}
      }
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async delete(id: number) {
    try {
      await prisma.user.update({
        where: { id: id },
        data: { excludedStatus: true },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async deleteAllEmployees() {
    try {
      await prisma.user.updateMany({
        where: { user_type: 2 },
        data: { excludedStatus: true },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async authUser(userData: User) {
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
    }
  };
  static async tokenCreate(id: number) {
    try {
      if (id != undefined) {
        const result = await prisma.token_Recovery.create({
          data: {
            user_id: id,
            isActive: true,
          },
        });
        return result != null
          ? { status: true, result: result.token }
          : { status: true, result: undefined };
      }
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async tokenValited(token) {
    try {
      const tokenIsValid = await prisma.token_Recovery.findUnique({
        where: {
          token: token,
        },
      });
  
      return tokenIsValid == undefined
        ? { status: true, isValid: false }
        : {
          status: true,
          isValid: true,
          tokenIsValid,
        };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async tokenDelete(id: number) {
    try {
      const result = await prisma.token_Recovery.deleteMany({
        where: {
          user_id: id,
        },
      });
      return result.count > 0 ? { status: true } : { status: false };
    } catch (error) {
      return { status: false, error: error };
    }
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
    }
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
          isActive: false,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    }
  };
  static async isFuncionario(id) {
    const user = await prisma.user.findFirst({ where: { id: id } });
    return user?.user_type == 2 ? { is: true } : { is: false };
  }
}
