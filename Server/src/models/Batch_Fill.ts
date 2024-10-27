import Decimal from "decimal.js";
import Fill from "./Fill";
import Batch from "./Batch";
import ILogFill from "./LogFill";

interface IBatch_Fill {
    fill: Fill;
    batch: Batch;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  }
  class Batch_Fill {
    fill: Fill;
    batch: Batch;
    quantity: number;
    costPrice: Decimal;
    subtotal: Decimal;
    iLogFill?: ILogFill;
  
    public constructor({ fill, batch, quantity, costPrice, subtotal }: IBatch_Fill) {
      this.fill = fill;
      this.batch = batch;
      this.quantity = quantity;
      this.costPrice = costPrice;
      this.subtotal = subtotal; 
    }
  }
  
  export default Batch_Fill;
  