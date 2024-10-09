import { existsSync } from "fs";
import { prisma } from "../config/prisma";
import BatchEntity from "../entities/Batch";

export default class Batch {
    static async findAll() {
        try {
            const batchs = await prisma.batch.findMany({
                where: {
                    deletionStatus: false
                }
            });
            return { status: true, batchs: batchs };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async create(batchData: BatchEntity) {
        try {
            const verifyBatchExistst = await Batch.verifyBatchAlredyExists(batchData);

            if (verifyBatchExistst.exists) {
                await prisma.batch.update({
                    where: {
                        id: verifyBatchExistst.batch_id
                    },
                    data: {
                        quantity: {
                            increment: batchData.quantity
                        }
                    }
                });
                return { status: true, message: "Update quantity" }
            }
            else {
                const batchResult = await prisma.batch.create({
                    data: {
                        expirationDate: batchData.expirantionDate,
                        quantity: batchData.quantity,
                        deletionStatus: false,
                        product_id: batchData.product_id,
                        eValidationStatus: 1,
                    }
                });
                return { status: true, batch: batchResult }
            };
        } catch (error) {
            return { status: false, error: error }
        };
    };
    static async findByProduct(batchData: BatchEntity) {
        try {
            const batch = await prisma.batch.findMany({
                include: {
                    product_id_fk: {
                        select: {
                            excludedStatus: false
                        }
                    }
                },
                where: {
                    AND: {
                        product_id: batchData.product_id,
                    },

                },
                orderBy: {

                }
            });
            return { status: true, batch: batch };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async findBySupplier(supplier_id) {
        try {
            const batch = await prisma.$queryRaw
                `
                SELECT b.id as batch_id, p.name as product_name, s.name as supplier_name, b.quantity as product_quantity
                FROM product p 
                INNER JOIN batch b 
                ON p.id = b.product_id
                INNER JOIN supplier s
                ON b.supplier_id = s.id
                WHERE b.supplier_id = ${supplier_id}
            `;
            return { status: true, batch: batch };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    //Arrumar
    static async findBatch(batchData: BatchEntity) {
        try {
            const batch = await prisma.batch.findFirst({
                include: {
                    product_id_fk: {
                        select: {
                            excludedStatus: false
                        }
                    }
                },
                where: {
                    AND: {
                        product_id: batchData.product_id,
                    },
                }
            });
            return { status: true, batch: batch };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async update(batchData: BatchEntity) {
        try {
            const findBatch = await this.findBatch(batchData);
            const batchUpdated = await prisma.batch.update({
                data: {
                    quantity: batchData.quantity
                },
                where: {
                    id: findBatch.batch?.id
                }
            });
            return { status: true, batch: batchUpdated };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async delete(batchData: BatchEntity) {
        try {
            const batchResult = await prisma.batch.delete({
                where:{
                    id: batchData.id
                }
            });
            return { status: true };
        } catch (error) {
            return { status: false, error: error };
        };
    };
    static async verifyBatchAlredyExists(batch: BatchEntity) {
        try {
            const batchResult = await prisma.batch.findFirst({
                where: {
                    AND: {
                        product_id: batch.product_id,
                        expirationDate: batch.expirantionDate
                    }
                }
            });
            return batch != null ? { status: true, exists: true, batch_id: batchResult!.id } :
                { status: true, exists: false };
        } catch (error) {
            return { status: false, error: error };
        };
    };
};