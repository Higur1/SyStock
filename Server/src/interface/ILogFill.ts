import User from "./IUser";
import Fill from "./IFill";

interface InterfaceLogFill {
  id?: number;
  user: User;
  fill: Fill;
}
class ILogFill {
  id?: number;
  user: User;
  fill: Fill;

  public constructor({ user, fill }: InterfaceLogFill) {
    this.user = user;
    this.fill = fill;
  }
}

export default ILogFill;
