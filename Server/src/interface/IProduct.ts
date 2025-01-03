import Decimal from "decimal.js";

interface InterfaceProduct {
  id?: number;
  name: string;
  price: Decimal;
  costPrice: Decimal;
  minimunQuantity: number;
  observation?: string;
  totalQuantityInStock?: number;
  category_id?: number;
  excludedStatus?: boolean;
}

class IProduct {
  id?: number;
  name: string;
  price: Decimal;
  costPrice: Decimal;
  minimunQuantity: number;
  observation?: string;
  totalQuantityInStock?: number;
  category_id?: number;
  excludedStatus?: boolean;

  public constructor({
    name,
    price,
    costPrice,
    minimunQuantity,
    observation,
    category_id
  }: InterfaceProduct) {
    this.name = name;
    this.price = new Decimal(price);
    this.costPrice = new Decimal(costPrice);
    this.minimunQuantity = minimunQuantity;
    this.observation = observation;
    this.totalQuantityInStock = 0;
    this.category_id = category_id;
    this.excludedStatus = false;
  }
}

export default IProduct;
