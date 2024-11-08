import {prisma} from "../config/prisma";
import IBatchFill from "../interface/IBatchFill";
import {} from "../functions/baseFunctions"
export default class BatchFill{
    static async create(batchFill: IBatchFill){
        try {
            const batchFillResult = await prisma.batch_Fill.create({
                data:{
                    costPrice: batchFill.costPrice,
                    quantity: batchFill.quantity,
                    subTotal: batchFill.subtotal,
                    batch_id: batchFill.batch_id,
                    fill_id: batchFill.fill_id,
                }
            })
            return {status: true, batch_fill: batchFillResult}
        } catch (error) {
            return {status: false, error:error}
        }
    }
}