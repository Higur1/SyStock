import Account from "../Account";

export default class AccountMapper {
  toServer(obj = new Account({})) {
    return {
      user: obj.user,
      password: obj.password
    }
  }

  toInterface() {

  }
}