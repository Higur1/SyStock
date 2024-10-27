import User from "./User";
import Fill from "./Fill";

interface ILogFill {
  id?: number;
  user: User;
  fill: Fill;
}
class LogFill {
  id?: number;
  user: User;
  fill: Fill;

  public constructor({ user, fill }: ILogFill) {
    this.user = user;
    this.fill = fill;
  }
}

export default LogFill;
