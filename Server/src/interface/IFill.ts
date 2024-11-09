import Decimal from "decimal.js";

interface InterfaceFill {
  totalPrice: Decimal;
  dateTime?: Date;
  supplier_id: number;
  observation?: string;
  user_id: number;
}

class IFill {
  id?: number;
  totalPrice: Decimal;
  dateTime?: Date;
  supplier_id: number;
  observation?: string;
  user_id: number;

  public constructor({
    totalPrice,
    observation,
    supplier_id,
    user_id,
  }: InterfaceFill) {
    this.totalPrice = new Decimal(totalPrice);
    this.dateTime = new Date();
    this.observation = observation;
    this.supplier_id = supplier_id;
    this.user_id = user_id;
  }
}

export default IFill;
