import IUser from "../interface/IUser";
import UserModel from "../models/UserModel";
import PreUserModel from "../models/PreUserModel";
import IPreUser from "../interface/IPreUser";
import bcrypt from "bcryptjs";

export default class UserService{
    static async list(){
        try {
            const list = await UserModel.findAll();

            return list;
        } catch (error) {
            throw error;
        };
    };
    static async find(userData: IUser){
        try {
            const findResult = await UserModel.find(userData);
            if(findResult.user == undefined){
                throw new Error("User not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async findByNameList(userData: IUser){
        try {
            const findResult = await UserModel.findByNameStartWith(userData);

           return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async findByName(userData: IUser){
        try {
            const findResult =  await UserModel.findByName(userData);

            if(!findResult.exists){
                throw new Error("User not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async create(userData: IUser){
        try {
            const preUserData: IPreUser = {
                email: userData.email,
                name: userData.name
            };
            const verifyPreUser = await PreUserModel.findPreUser(preUserData);
       
            if(!verifyPreUser.exists){
                throw new Error("Pre_user not found");
            };

            const verifyEmailAlreadyUsed = await UserModel.findByEmail(userData);

            if(verifyEmailAlreadyUsed.exists){
                throw new Error("Email already used");
            };
            const hash_password = cryptPassword(userData.password);
            userData.password = hash_password
            const createResult = await UserModel.create(userData);

            return createResult;
        }catch(error){
            throw error;
        };
    };
    static async update(userData: IUser){
        try {
            const verifyNameAlreadyExists = await UserModel.findByName(userData);

            if(verifyNameAlreadyExists.exists){
                throw new Error("Name already exists");
            };

            const verifyEmailAlreadyExists = await UserModel.findByEmail(userData);

            if(verifyEmailAlreadyExists.exists){
                throw new Error("User email alredy exists");
            };

            const verifyUserExists = await UserModel.find(userData);

            if(verifyUserExists.user == undefined){
                throw new Error("User not found");
            };
            const updatedResult = await UserModel.update(userData);

            return updatedResult;
        } catch (error) {
            throw error;
        };
    };
    static async editPassword(userData: IUser){
        try {
            const findUser = await UserModel.find(userData);

            if(findUser.user == undefined){
                throw new Error("User not found");
            };
            const hash_password = cryptPassword(userData.password);
            userData.password = hash_password

            const passwordUpdate = await UserModel.updatePassword_editUser(userData);

            return passwordUpdate;
        } catch (error) {
            throw error;
        };
    };
    static async delete(userData: IUser){
        try {   
            const findUser = await UserModel.find(userData);

            if(findUser.user == undefined){
                throw new Error("User not found");
            };
            if(findUser.user.user_type == 1){
                throw new Error("It is not possible to delete the admin user");
            };
            const deleteResult = await UserModel.delete(userData);

            return deleteResult;
        } catch (error) {
            throw error;
        };
    };
    static async resetPassword(token, password){
        try {
            const validToken = await UserModel.tokenValited(token);
         
            if(!validToken.isValid){
                throw new Error("Invalid token");
            };
            if(!validToken.tokenIsValid?.isActive){
                throw new Error("Token already used");
            };
            const hashPassword = await cryptPassword(password);
            const resultUpdatedPassword = await UserModel.updatePassword_resetPassword(
                validToken.tokenIsValid?.user_id, 
                validToken.tokenIsValid?.token, hashPassword
            );
            if(!resultUpdatedPassword.status){
                throw new Error("User not found");
            };

            return resultUpdatedPassword;
        } catch (error) {
            throw error;
        };
    };
};
function cryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

