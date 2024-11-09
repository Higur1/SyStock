import preUser from "../interface/IPreUser";
import { prisma } from "../config/prisma";

export default class PreUserService {
  static async findAll() {
    try {
      const listPreUsers = await prisma.pre_User.findMany({
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      return listPreUsers.length > 0
        ? { status: true, listPreUsers }
        : { status: true, listPreUsers: {} };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async create(user: preUser) {
    try {
      const preuser = await prisma.pre_User.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });
      return {
        status: true,
        preuser: {
          id: preuser.id,
          name: preuser.name,
          email: preuser.email,
        },
      };
    } catch (error) {
      return { status: false}
    };
  };
  static async find(preUserData: preUser) {
    try {
      const preuser = await prisma.pre_User.findFirst({
        where: {
          AND:[
            {email: preUserData.email}, {name: preUserData.name}
          ]
        },
      });

      return preuser != null
        ? { status: true, exists: true, preuser: preuser }
        : { status: true, exists: false, preuser: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async delete(preUser: preUser) {
    try {
      await prisma.pre_User.delete({
        where: {
          id: preUser.id,
        },
      });
      return { status: true };
    } catch (error) {
      return { status: false, error: error };
    };
  };
};

