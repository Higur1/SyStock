import Supplier from "../../../classes/Supplier"

export default class SupplierMappers {
  toServer(obj = new Supplier({})) {
    return {
      id: obj.id,
      name: obj.name,
      email: obj.email,
      phone: obj.phone
    }
  }

  toServerLogin({user, password}) {
    return {
      user_login:user,
      user_password: password
    }
  }

  toInterface({ id, name, mail, phone }) {
    return new Supplier({ id, name, mail, phone });
  }
}