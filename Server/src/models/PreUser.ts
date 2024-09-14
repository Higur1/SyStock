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
}
