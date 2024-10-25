import User from "./User";
import Batch_Fill from "./Batch_Fill";
import Supplier from "./Supplier";
import Decimal from "decimal.js";

interface ILogFill {
  totalPrice: Decimal;
  quantity: number;
  user: User;
  dateTime?: Date;
  supplier?: Supplier;
  observation: string;
  batch_fill: Array<Batch_Fill>;
}
class LogFill {
  id?: number;
  totalPrice: Decimal;
  quantity: number;
  user: User;
  dateTime?: Date;
  supplier?: Supplier;
  observation: string;
  batch_fill: Array<Batch_Fill>;

  public constructor({ totalPrice, quantity, user, observation, batch_fill }: ILogFill) {
    this.totalPrice = totalPrice;
    this.quantity = quantity;
    this.user = user;
    this.observation = observation;
    this.batch_fill = batch_fill;
  }
}

export default LogFill;
