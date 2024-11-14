import { prisma } from "../config/prisma"
import IFill from "../interface/IFill";

export default class FillModel {
    static async create(fill: IFill) {
        try {
            const fillResult = await prisma.fill.create({
                data: {
                    totalPrice: fill.totalPrice,
                    supplier_id: fill.supplier_id,
                    user_id: fill.user_id,
                    observation: fill.observation || "",
                },
            });
            return { status: true, fill: fillResult };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async findAll() {
        try {
            const fills = await prisma.fill.findMany({
                orderBy: { createdAt: "desc" },
            });
            return { status: true, fills: fills };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async findById(fill: IFill) {
        try {
            const fillFinded = await prisma.fill.findUnique({
                where: { id: fill.id },
                include:{
                    Batch_Fill: {
                       
                    }
                }
            });
            return fill != undefined ? { status: true, exists: true, fill: fillFinded } 
                                     : { status: true, exists: false, fill: undefined };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async findBySupplierId(fill: IFill) {
        try {
            const fillFinded = await prisma.fill.findMany({
                where: { supplier_id: fill.supplier_id },
            });
            return fillFinded != undefined ? { status: true, exists: true, fill: fillFinded } 
                                           : { status: true, exists: false, fill: {}}
        } catch (error) {
            return { status: false, error: error };
        };
    };
};