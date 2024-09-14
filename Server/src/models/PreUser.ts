import { prisma } from "../config/prisma";

export default class PreUser {
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
    }
  }
  static async create(
    name, 
    email
  ) {
    try {
      const preuser = await prisma.pre_User.create({
        data: {
          name, 
          email
        },
      });
      return {
        status: true,
        preuser: {
          id: preuser.id,
          name: preuser.name,
          email: preuser.email
        },
      };
    } catch (error) {
      return {status: false, error: error }
    }
  }
  static async findPreUser(){}
}
