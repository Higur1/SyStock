import Decimal from "decimal.js";
import Batch_Fill from "./Batch_Fill";

interface IFill {
  totalPrice: Decimal;
  dateTime?: Date;
  supplier_id: number;
  observation: string;
  user_id: number;
  batchs_fills: Array<Batch_Fill>;
}

class Fill {
  id?: number;
  totalPrice?: Decimal;
  dateTime?: Date;
  supplier_id: number;
  observation: string;
  user_id: number;
  batchs_fills: Array<Batch_Fill>;

  public constructor({
    totalPrice,
    observation,
    supplier_id,
    user_id,
    batchs_fills,
  }: IFill) {
    this.totalPrice = new Decimal(totalPrice);
    this.dateTime = new Date();
    this.observation = observation;
    this.supplier_id = supplier_id;
    this.user_id = user_id;
    this.batchs_fills = batchs_fills;
  }
  private calcTotalPriceInClass() {
    let acumula: Decimal;
    acumula = new Decimal(0);
    this.batchs_fills.forEach((element) => {
      if (element.subtotal != undefined) {
        acumula = acumula.plus(element.subtotal);
      } else {
        return { status: false, error: "elemento com valor undefined" };
      }
    });
    this.totalPrice = acumula;
  }
  public calcTotalPrice(fill: Fill) {
    let acumula: Decimal;
    acumula = new Decimal(0);
    this.batchs_fills.forEach((element) => {
      if (element.subtotal != undefined) {
        acumula = acumula.plus(element.subtotal);
      } else {
        return { status: false, error: "elemento com valor undefined" };
      }
    });
    return { status: true, totalPrice: acumula };
  }
}

export default Fill;
