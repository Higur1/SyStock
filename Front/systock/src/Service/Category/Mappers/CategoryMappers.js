import Account from "../../../classes/Account";
import Category from "../../../classes/Category";

export default class CategoryMappers {
  toServer(obj = new Category({})) {
    return {
      name: obj.name
    }
  }

  toServerPut(obj = new Category({})) {
    return {
      id: obj.id,
      name: obj.name
    }
  }

  toServerPutMail(obj = new Category({})) {
    return {
      id: obj.id,
      novoEmail: obj.email
    }
  }

  toServerPutPassword(obj = new Category({})) {
    return {
      id: obj.id,
      novaPassword: obj.password
    }
  }

  toServerLogin({user, password}) {
    return {
      user_login:user,
      user_password: password
    }
  }

  toInterface({ id, name }) {
    return new Category({ id, name });
  }
}