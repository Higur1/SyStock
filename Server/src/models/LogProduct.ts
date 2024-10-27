import Product from "./Product";
import User from "./User";


interface ILogProduct {
    id?: number;
    product: Product;
    quantity: number;
    user: User;
    dateTime?: Date;
    eTypeAction: number;
    motivo: string;
  }
  class LogProduct {
    id?: number;
    product: Product;
    quantity: number;
    user: User;
    eTypeAction: number;
    motivo: string;
    dateTime?: Date;
  
    public constructor({ product, quantity, eTypeAction, motivo, user }: ILogProduct) {
      this.product = product;
      this.dateTime = new Date();
      this.quantity = quantity;
      this.eTypeAction = eTypeAction;
      this.motivo = motivo; 
      this.user = user;
    }
  }
  
  export default LogProduct;