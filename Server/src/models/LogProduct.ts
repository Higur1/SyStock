import Product from "./Product";

interface ILogProduct {
    product: Product;
    quantity: number;
    dateTime?: Date;
    eTypeAction: number;
    motivo: string;
  }
  class LogProduct {
    id?: number;
    product: Product;
    quantity: number;
    eTypeAction: number;
    motivo: string;
    dateTime?: Date;
  
    public constructor({ product, quantity, eTypeAction, motivo }: ILogProduct) {
      this.product = product;
      this.dateTime = new Date();
      this.quantity = quantity;
      this.eTypeAction = eTypeAction;
      this.motivo = motivo; 
    }
  }
  
  export default LogProduct;
  