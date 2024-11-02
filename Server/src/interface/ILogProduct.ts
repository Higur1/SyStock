import Product from "./IProduct";
import User from "./IUser";


interface InterfaceLogProduct {
    id?: number;
    product: Product;
    quantity: number;
    user: User;
    dateTime?: Date;
    eTypeAction: number;
    motivo: string;
  }
  class ILogProduct {
    id?: number;
    product: Product;
    quantity: number;
    user: User;
    eTypeAction: number;
    motivo: string;
    dateTime?: Date;
  
    public constructor({ product, quantity, eTypeAction, motivo, user }: InterfaceLogProduct) {
      this.product = product;
      this.dateTime = new Date();
      this.quantity = quantity;
      this.eTypeAction = eTypeAction;
      this.motivo = motivo; 
      this.user = user;
    }
  }
  
  export default ILogProduct;