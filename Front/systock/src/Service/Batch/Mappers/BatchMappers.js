import Batch from "../../../classes/Batch";

export default class BatchMappers {
  toServer(obj = new Batch({})) {
    return {
      product_id: 0, 
      supplier_id: 0, 
      quantity: 0 
    }
  }

  toServerPut(obj = new Batch({})) {
    return {
      id: obj.id,
      name: obj.name
    }
  }

  toServerPutMail(obj = new Batch({})) {
    return {
      id: obj.id,
      novoEmail: obj.email
    }
  }

  toServerPutPassword(obj = new Batch({})) {
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
    return new Batch({ id, name });
  }
}