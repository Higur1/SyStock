import preUser from "../entities/PreUser"
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
    };
  };
  static async create(user: preUser) {
    try {
      const preUserResult = await PreUser.findPreUser(user);
      console.log(preUserResult)
      if (preUserResult.preuser == undefined) {
        const preuser = await prisma.pre_User.create({
          data: {
            name: user.name,
            email: user.email
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
      } else {
        return { status: true, message: "PreUser alredy exists" }
      };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async findPreUser(preUserData: preUser) {
    try {
      const preuser = await prisma.pre_User.findFirst({
        where: {
          AND:{
            email: preUserData.email,
            name: preUserData.name
          }
        }
      });

      return preuser != null
        ? { status: true, preuser: preuser }
        : { status: true, preuser: undefined };
    } catch (error) {
      return { status: false, error: error };
    };
  };
  static async delete() {
    try {
      await prisma.pre_User.deleteMany({});
      return { status: true }
    } catch (error) {
      return { status: false, error: error };
    };
  };
};
