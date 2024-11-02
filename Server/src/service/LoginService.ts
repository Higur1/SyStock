import IUser from "../interface/IUser";
import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../functions/nodemailer";

export default class LoginService {
    static async auth(userData: IUser) {
        try {
            const findUser = await UserModel.authUser(userData);

            if (findUser.user == undefined) {
                throw new Error("User not found");
            };

            const checkPassword = await bcrypt.compare(userData.password, findUser.user.password);
            if (!checkPassword) {
                throw new Error("Incorrect login or password");
            };

            const kwnokey = process.env.JWTSecret;
            const token = jwt.sign({
                id: findUser.user.id,
                email: findUser.user.email,
                user_type: findUser.user.user_type
            },
                kwnokey!,
                { expiresIn: "24h" }
            );

            return token;
        } catch (error) {
            throw error;
        }
    }
    static async recovery(userData: IUser, instance) {
        try {
            const findEmail = await UserModel.findByEmail(userData);

            if(!findEmail.exists){
                throw new Error("Email not found");
            };

            const createToken = await UserModel.tokenCreate(findEmail.user!.id)
            sendEmail(findEmail.user?.email, createToken.result, instance);
        } catch (error) {
            throw error;
        }
    }
}