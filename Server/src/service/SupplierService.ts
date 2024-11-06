import ISupplier from "../interface/ISupplier";
import SupplierModel from "../models/SupplierModel";

export default class SupplierService {
    static async findAll() {
        try {
            const list = await SupplierModel.findAll();

            return list;
        } catch (error) {
            throw error;
        };
    }; 
    static async create(suppliderData: ISupplier) {
        try {
            const validatedSupplierDataExists = await validatedSupplierData(suppliderData);
            if (validatedSupplierDataExists.length > 0) {
                throw new Error(validatedSupplierDataExists.join(', '))
            };

            const createResult = await SupplierModel.create(suppliderData);

            return createResult.supplier;
        } catch (error) {
            throw error;
        };
    };
    static async find(suppliderData: ISupplier) {
        try {
            const findResult = await SupplierModel.find(suppliderData);

            if (findResult.supplier == undefined) {
                throw new Error("Supplier not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async findByName(suppliderData: ISupplier) {
        try {
            const findResult = await SupplierModel.findByName(suppliderData);

            if (!findResult.exists) {
                throw new Error("Supplier not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        };
    };
    static async findNameStartWith(suppliderData: ISupplier) {
        try {
            const listName = await SupplierModel.findNameStartsWith(suppliderData);

            return listName;
        } catch (error) {
            throw error;
        };
    };
    static async update(suppliderData: ISupplier) {
        try {
            const validatedSupplierDataExists = await validatedSupplierData(suppliderData);

            if (validatedSupplierDataExists.length > 0) {
                throw new Error(validatedSupplierDataExists.join(', '));
            };
            const findSupplider = await SupplierModel.find(suppliderData);
            if (findSupplider.supplier == undefined) {
                throw new Error("Supplier not found")
            };
            const updatedResult = await SupplierModel.update(suppliderData);

            return updatedResult;
        } catch (error) {
            throw error;
        };
    };
    static async delete(suppliderData: ISupplier) {
        try {
            const findSupplier = await SupplierModel.find(suppliderData);

            if (findSupplier.supplier == undefined) {
                throw new Error("Supplier not found");
            };

            const supplierRemove = await SupplierModel.delete(suppliderData);

            return supplierRemove;
        } catch (error) {
            throw error; 
        };
    };
};
async function validatedSupplierData(suppliderData: ISupplier) {
    const messages: string[] = [];

    const validatedName = await SupplierModel.findByName(suppliderData);
    const validatedEmail = await SupplierModel.findByEmail(suppliderData);
    const validatedPhone = await SupplierModel.findByPhone(suppliderData);

    if(validatedName.supplier?.name !== undefined){
        messages.push("Name already exists");
    }
    if(validatedEmail.supplier?.email !== undefined){
        messages.push("Email already exists");
    }
    if(validatedPhone.supplier?.phone !== undefined){
        messages.push("Phone already exists");
    }

    return messages;
};