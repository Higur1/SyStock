import Decimal from "decimal.js";
import ILogFill from "./ILogFill";

interface InterfaceBatch_Fill {
    fill_id: number;
    batch_id: number;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  }
  class IBatch_Fill {
    fill_id: number;
    batch_id: number;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  
    public constructor({ fill_id, batch_id, quantity, costPrice, subtotal }: InterfaceBatch_Fill) {
      this.fill_id = fill_id;
      this.batch_id = batch_id;
      this.quantity = quantity;
      this.costPrice = costPrice;
      this.subtotal = subtotal; 
    }
  }
  
  export default IBatch_Fill;
  