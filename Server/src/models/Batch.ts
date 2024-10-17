interface IBatch {
    expirantionDate: Date;
    quantity: number;
    deletationStatus?: false;
    dateTimeEmptyStock?: Date;
    product_id: number;
    eValidationStatus?: number
}

class Batch {
    id?: number
    product_id: number
    expirantionDate: Date
    quantity: number
    deletationStatus?: false
    eValidationStatus?: number

    public constructor({
        expirantionDate,
        quantity,
        deletationStatus,
        product_id,
    }: IBatch) {
        this.expirantionDate = expirantionDate,
            this.quantity = quantity;
        this.deletationStatus = deletationStatus;
        this.product_id = product_id;
        this.expirantionDate.setHours(-3);
        this.expirantionDate.setMinutes(0);
        this.expirantionDate.setSeconds(0);
        this.expirantionDate.setMilliseconds(0);
        const dateNow = new Date();
        dateNow.setHours(-3);
        dateNow.setMinutes(0);
        dateNow.setSeconds(0);
        dateNow.setMilliseconds(0);
        if (expirantionDate.toISOString() === dateNow.toISOString()) {
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
    }
}
export default Batch;