import Batch_Fill from "./IBatchFill"; 

interface InterfaceBatch {
    id?: number;
    expirantionDate: Date;
    quantity: number;
    deletationStatus?: boolean;
    dateTimeEmptyStock?: Date;
    product_id: number;
    eValidationStatus?: number;
    batchs_fills?: Array<Batch_Fill>;
}

class IBatch {
    id?: number
    product_id: number
    expirantionDate: Date
    quantity: number
    deletationStatus?: boolean
    eValidationStatus?: number
    batchs_fills?: Array<Batch_Fill>;

    public constructor({
        expirantionDate,
        quantity,
        product_id,
        batchs_fills
    }: InterfaceBatch) {
        this.expirantionDate = expirantionDate,
            this.quantity = quantity;
        this.deletationStatus = false;
        this.product_id = product_id;
        this.expirantionDate.setDate(this.expirantionDate.getDate()+1)
        this.expirantionDate.setHours(-3);
        this.expirantionDate.setMinutes(0);
        this.expirantionDate.setSeconds(0);
        this.expirantionDate.setMilliseconds(0);
        const dateNow = new Date();
        dateNow.setHours(-3);
        dateNow.setMinutes(0);
        dateNow.setSeconds(0);
        dateNow.setMilliseconds(0);
        if ((expirantionDate.toISOString() === dateNow.toISOString()) || (dateNow.toISOString() > expirantionDate.toISOString())) {
            this.eValidationStatus = 1;
        }
        else {
            const dateCalcValidadeProxima = dateNow
            dateCalcValidadeProxima.setDate(dateNow.getDate() + 7)
            
            if (expirantionDate.toISOString() <= dateCalcValidadeProxima.toISOString()) {
                this.eValidationStatus = 2;
            }
            else if (expirantionDate.toISOString() > dateCalcValidadeProxima.toISOString()) {
                this.eValidationStatus = 3;
            }
        }
        this.batchs_fills = batchs_fills;
    }
}
export default IBatch;