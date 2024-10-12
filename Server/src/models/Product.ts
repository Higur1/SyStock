import Decimal from "decimal.js"

interface IProduct {
    id?: number;
    name: string;
    price: Decimal;
    costPrice: Decimal;
    minimunQuantity: number;
    observation?: string;
    totalQuantityInStock?: number;
    category_id: number;
    excludedStatus?: boolean;
}

class Product {
    id?: number
    name: string
    price: Decimal
    costPrice: Decimal
    minimunQuantity: number
    observation?: string
    totalQuantityInStock?: number
    category_id: number
    excludedStatus?: boolean

    private constructor({
        name,
        price,
        costPrice,
        minimunQuantity,
        observation,
        totalQuantityInStock,
        category_id,
        excludedStatus
    }: IProduct) {
        this.name = name;
        this.price = new Decimal(price);
        this.costPrice = new Decimal(costPrice);
        this.minimunQuantity = minimunQuantity;
        this.observation = observation;
        this.totalQuantityInStock = totalQuantityInStock;
        this.category_id = category_id;
        this.excludedStatus = excludedStatus
    }

}

export default Product;
