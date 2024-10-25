import Decimal from "decimal.js";

interface IFill {
  id?: number;
  totalPrice: Decimal;
  dateTime: Date;
  supplier_id: number;
  observation: string;
  user_id: number;
}

class Fill {
  id?: number;
  totalPrice: Decimal;
  dateTime: Date;
  supplier_id: number;
  observation: string;
  user_id: number;

  public constructor({
    totalPrice,
    observation,
    supplier_id,
    user_id,
  }: IFill) {
    this.totalPrice = new Decimal(totalPrice);
    this.dateTime = new Date();
    this.observation = observation;
    this.supplier_id = supplier_id;
    this.user_id = user_id;
  }
}
export default Fill;
