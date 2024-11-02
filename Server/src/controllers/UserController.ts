import { z } from "zod";
import IUser from "../interface/IUser";
import UserService from "../service/UserService";
import convert from "../functions/convertToNumber";

export default class UserController {
    static async list(request, response) {
        try {
            const list = await UserService.list();

            response.status(200).send(JSON.stringify({
                Users: list.listUsers
            }));
        } catch (error) {
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async find(request, response) {
        try {
            const userValidation = z.object({
                id: z.string().min(1)
            });
            const { id } = userValidation.parse(request.params);
            const convertID = convert(id);
           
            const userData: IUser = {
                id: convertID,
                email: "",
                login: "",
                name: "",
                password: "",
            };

            const findResult = await UserService.find(userData);
            
            response.status(200).send(JSON.stringify({
                User: findResult.user
            }));
        } catch (error) {
            if (error.message == "Expected a number and received a string") {
                response.status(400).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message == "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async findByNameList(request, response) {
        try {
            const userValidation = z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, "Name required minimum 1 character(s)")
                    .max(20, "Name required maximum 20 character(s)"),
            });
            const { name } = userValidation.parse(request.params);

            const userData: IUser = {
                email: "",
                login: "",
                name: name,
                password: "",
            };

            const listResult = await UserService.findByNameList(userData);

            response.status(200).send(JSON.stringify({
                Users: listResult.user
            }));
        } catch (error) {
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async findByName(request, response) {
        try {
            const userValidation = z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, "Name required minimum 1 character(s)")
                    .max(20, "Name required maximum 20 character(s)"),
            });
            const { name } = userValidation.parse(request.params);

            const userData: IUser = {
                email: "",
                login: "",
                name: name,
                password: "",
            };

            const listResult = await UserService.findByName(userData);

            response.status(200).send(JSON.stringify({
                User: listResult.user
            }));
        } catch (error) {
            if (error.message == "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async create(request, response) {
        try {
            const userValidation = z.object({
                name: z
                    .string()
                    .trim()
                    .min(5, "Name required minimum 5 character(s)")
                    .max(20, "Name required Maximum 20 character(s)"),
                login: z
                    .string()
                    .trim()
                    .min(5, "user_login required minimum 5 character(s)")
                    .trim()
                    .max(10, "user_login required maximum 10 character(s)")
                    .trim(),
                password: z
                    .string()
                    .trim()
                    .min(5, "user_password required minimum 5 character(s)")
                    .max(10, "user_password required maximum 10 character(s)"),
                email: z.string().email("Valid e-mail required").trim(),
            });
            const { name, login, password, email } = userValidation.parse(
                request.body
            );
            const userData: IUser = {
                email: email,
                login: login,
                name: name,
                password: password,
            };

            const createResult = await UserService.create(userData);

            response.status(201).send(JSON.stringify({
                User: createResult.user
            }));
        } catch (error) {
            if (error.message === "Pre_user not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Email already used") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async edit(request, response) {
        try {
            const userValidation = z.object({
                id: z.number().min(1, "id required minimum 1 character(s)"),
                name: z
                    .string()
                    .trim()
                    .min(3, "Name required minimum 3 character(s)")
                    .max(20, "Name required maximum 20 character(s)")
                    .optional(),
                email: z.string().email("Valid e-mail required").trim().optional()
            });

            const { id, name, email } = userValidation.parse(request.body);

            const userData: IUser = {
                id: id,
                email: email ?? "",
                login: "",
                name: name ?? "",
                password: "",
            };
            const updateResult = await UserService.update(userData);

            response.status(200).send(JSON.stringify({
                User: updateResult.user
            }));
        } catch (error) {
            if (error.message === "Name already exists") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Email already exists") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async editPassword(request, response) {
        try {
            const userValidation = z.object({
                id: z.number().min(1, "id required minimum 1 character(s)"),
                newPassword: z
                    .string()
                    .trim()
                    .min(5, "user_password required minimum 5 character(s)")
                    .max(10, "user_password required maximum 10 character(s)"),
            });

            const { id, newPassword } = userValidation.parse(request.body);

            const userData: IUser = {
                id: id,
                email: "",
                login: "",
                name: "",
                password: newPassword,
            };
            await UserService.editPassword(userData);

            response.status(200).send(JSON.stringify({
                Message: "Password updated successfully"
            }));
        } catch (error) {
            if (error.message === "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async delete(request, response) {
        try {
            const userValidation = z.object({
                id: z.string().min(1, "id required minimum 1 character(s)").trim(),
            });
            const { id } = userValidation.parse(request.params);

            const userData: IUser = {
                id: Number(id),
                email: "",
                login: "",
                name: "",
                password: "",
            };

            await UserService.delete(userData);

            response.status(200).send(JSON.stringify({
                Message: "User deleted succesfully"
            }));
        } catch (error) {
            if (error.message === "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "It is not possible to delete the admin user") {
                response.status(403).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
    static async resetPassword(request, response) {
        try {
            const passwordResetValidation = z.object({
                token: z
                    .string()
                    .trim()
                    .min(36, "token required minimum 36 character(s)")
                    .max(36, "token required maximum 36 character(s)"),
                password: z
                    .string()
                    .min(5, "user_password required minimum 5 character(s)")
                    .max(10, "user_password required maximum 10 character(s)"),
            });
            const { token, password } = passwordResetValidation.parse(request.body);

            await UserService.resetPassword(token, password);

            response.status(200).send(JSON.stringify({
                Message: "Password updated successfully"
            }));
        } catch (error) {
            if (error.message === "User not found") {
                response.status(404).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Token already used") {
                response.status(400).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Invalid token") {
                response.status(409).send(JSON.stringify({
                    Message: error.message
                }));
            };
            if (error.message === "Internal Server Error") {
                response.status(500).send(JSON.stringify({
                    Error: error.message
                }));
            };
            response.status(400).send(JSON.stringify({
                Error: error.issues[0].message
            }));
        };
    };
};