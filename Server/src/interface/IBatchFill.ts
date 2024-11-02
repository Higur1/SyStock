import Decimal from "decimal.js";
import Fill from "./IFill";
import Batch from "./IBatch";
import ILogFill from "./ILogFill";

interface InterfaceBatch_Fill {
    fill: Fill;
    batch: Batch;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  }
  class IBatch_Fill {
    fill: Fill;
    batch: Batch;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  
    public constructor({ fill, batch, quantity, costPrice, subtotal }: InterfaceBatch_Fill) {
      this.fill = fill;
      this.batch = batch;
      this.quantity = quantity;
      this.costPrice = costPrice;
      this.subtotal = subtotal; 
    }
  }
  
  export default IBatch_Fill;
  