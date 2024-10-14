interface IBatch {
    expirantionDate: Date;
    quantity: number;
    deletationStatus?: false;
    dateTimeEmptyStock?: Date;
    product_id: number;
    eValidationStatus: number
}

class Batch {
    id?: number
    product_id: number
    expirantionDate: Date
    quantity: number
    deletationStatus?: false
    eValidationStatus: number

    private constructor({
        expirantionDate,
        quantity,
        deletationStatus,
        product_id,
        eValidationStatus 
    }: IBatch) {
        this.expirantionDate = expirantionDate,
        this.quantity = quantity;
        this.deletationStatus = deletationStatus;
        this.product_id = product_id;
        this.eValidationStatus = eValidationStatus;
    }
}

export default Batch;