import ISupplier from "../interface/ISupplier";
import SupplierModel from "../models/SupplierModel";

export default class SupplierService {
    static async findAll() {
        try {
            const list = await SupplierModel.findAll();

            return list;
        } catch (error) {
            throw error;
        }
    }
    static async create(suppliderData: ISupplier) {
        try {
            const validatedSupplierDataExists = await validatedSupplierData(suppliderData);
            if (validatedSupplierDataExists.length > 0) {
                return new Error(validatedSupplierDataExists)
            }

            const createResult = await SupplierModel.create(suppliderData);

            return createResult.supplier;
        } catch (error) {
            throw error;
        }
    }
    static async find(suppliderData: ISupplier) {
        try {
            const findResult = await SupplierModel.find(suppliderData);

            if (findResult.supplier == undefined) {
                throw new Error("Supplier not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        }
    }
    static async findByName(suppliderData: ISupplier) {
        try {
            const findResult = await SupplierModel.findByName(suppliderData);

            if (!findResult.exists) {
                throw new Error("Supplider not found");
            };

            return findResult;
        } catch (error) {
            throw error;
        }
    }
    static async findNameStartWith(suppliderData: ISupplier) {
        try {
            const listName = await SupplierModel.findNameStartsWith(suppliderData);

            return listName;
        } catch (error) {
            throw error;
        }
    }
    static async update(suppliderData: ISupplier) {
        try {
            const validatedSupplierDataExists = await validatedSupplierData(suppliderData);

            if (validatedSupplierDataExists.length > 0) {
                throw new Error(validatedSupplierDataExists);
            }
            const findSupplider = await SupplierModel.find(suppliderData);
            if (findSupplider.supplier == undefined) {
                throw new Error("Supplier not found")
            }
            const updatedResult = await SupplierModel.update(suppliderData);

            return updatedResult;
        } catch (error) {
            throw error;
        }
    }
    static async delete(suppliderData: ISupplier) {
        try {
            const findSupplier = await SupplierModel.find(suppliderData);

            if (findSupplier.supplier == undefined) {
                throw new Error("Supplier not found")
            }

            const supplierRemove = await SupplierModel.delete(suppliderData);

            return supplierRemove;
        } catch (error) {
            throw error;
        }
    }
}
async function validatedSupplierData(suppliderData: ISupplier) {
    let message = "";
    const validatedName = await SupplierModel.findByName(suppliderData);
    message += validatedName.supplier?.name == undefined ? "" : "Name already exists";

    const validatedEmail = await SupplierModel.findByEmail(suppliderData);
    message += validatedEmail.supplier?.email == undefined ? "" : "Email already exists";

    const validatedPhone = await SupplierModel.findByPhone(suppliderData);
    message += validatedPhone.supplier?.phone == undefined ? "" : "Phone already exists";

    return message;
}