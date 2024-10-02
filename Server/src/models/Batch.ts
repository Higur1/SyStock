import { prisma } from "../config/prisma";

export default class Batch{
    static async findAll(){
        try {
            const batchs = await prisma.batch.findMany({
                where:{
                    deletionStatus: false
                }
            });
            return {status: true, batchs:batchs};
        } catch (error) {
            return {status: false, error:error};
        };
    };
    /*static async create(BatchObject){
        try {
            const batch = await prisma.batch.create({
                data:{
                    expirationDate: BatchObject.expirationDate,
                    quantity: BatchObject.quantity,
                    deletionStatus: false,
                    product_id: BatchObject.product_id,
                    eValidationSattus: 
                }
            })
        } catch (error) {
            
        }
    }*/
    static async findByProduct(product_id){
        try {
            const batch = await prisma.batch.findMany({
                include:{
                    product_id_fk: {
                        select:{
                            excludedStatus: false
                        }
                    }
                },
                where:{
                    AND:{
                        product_id:product_id,
                    },
                
                },
                orderBy:{
                    
                }
            });
            return {status: true, batch:batch};
        } catch (error) {
            return {status: false, error:error};
        };
    };
    static async findBySupplier(supplier_id){
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
            return {status: true, batch: batch};
        } catch (error) {
            return {status: false, error:error};
        };
    };
    static async findBatch(ObjectBatch){
        try {
            const batch = await prisma.batch.findFirst({
                include:{
                    product_id_fk: {
                        select:{
                            excludedStatus: false
                        }
                    }
                },
                where:{
                    AND:{
                        product_id: ObjectBatch.product_id,
                    }, 
                }
            });
            return {status: true, batch: batch};
        } catch (error) {
            return {status: false, error:error};
        };
    };
    static async update(ObjectBatch){
        try {
            const findBatch = await this.findBatch(ObjectBatch); 
            const batchUpdated = await prisma.batch.update({
                data:{
                    quantity: ObjectBatch.quantity
                },
                where:{
                    id: findBatch.batch?.id
                }
            });
            return {status: true, batch: batchUpdated};
        } catch (error) {
            return {status: false, error:error};
        };
    };
    static async delete(ObjectBatch){
        try {
            const findBatch = await this.findBatch(ObjectBatch);
            await prisma.batch.delete({
                where:{
                    id: findBatch.batch?.id
                }
            });
            return {status: true};
        } catch (error) {
            return {status: false, error:error};
        };
    };
};