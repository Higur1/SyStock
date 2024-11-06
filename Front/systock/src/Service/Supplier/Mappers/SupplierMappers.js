import Supplier from "../../../classes/Supplier"

export default class SupplierMappers {
  toServer(obj = new Supplier({})) {
    const phone = obj.phone
    .replace(" ", "")
    .replace("(", "")
    .replace(")", "")
    .replace("-", "");

    return {
      id: obj.id,
      name: obj.name,
      email: obj.email,
      phone
    }
  }

  toServerLogin({user, password}) {
    return {
      user_login:user,
      user_password: password
    }
  }

  toInterface({ id, name, email, phone }) {
    return new Supplier({ id, name, email, phone });
  }
}