import IPreUser from "../interface/IPreUser";
import PreUserModel from "../models/PreUserModel";

export default class PreUserService {
  static async list() {
    try {
      const list = await PreUserModel.findAll();

      return list;
    } catch (error) {
      throw new Error("An error has occurred");
    }
  }
  static async create(pre_user: IPreUser) {
    try {
      const verifyPreUserEmail = await PreUserModel.find(pre_user);

      if (verifyPreUserEmail.exists) {
        throw new Error(
          "An operation could not be performed. Email already used"
        );
      }
      const createResult = await PreUserModel.create(pre_user);

      return createResult;
    } catch (error) {
      throw error;
    }
  }
  static async find(preUserData: IPreUser) {
    try {
      const findResult = PreUserModel.find(preUserData);
      return findResult;
    } catch (error) {
      return { status: false, error: error };
    }
  }
  static async delete(pre_user: IPreUser) {
    try {
      const deletResult = await PreUserModel.delete(pre_user);

      return deletResult;
    } catch (error) {
      throw error;
    }
  }
}
