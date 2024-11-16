import Batch from "../../../classes/Batch";

export default class BatchMappers {
  toServer(obj = new Batch({})) {
    return {
      product_id: 0,
      supplier_id: 0,
      quantity: 0
    }
  }

  toServerCreate(obj = new Batch({})) {
    return {
      expirationDate: obj.expiry || null,
      product_id: obj.productID,
      quantity: obj.quantity
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

  toServerLogin({ user, password }) {
    return {
      user_login: user,
      user_password: password
    }
  }

  toInterface({ id, expirationDate, quantity, deletionStatus, dateTimeEmptyStock, product_id, eValidationStatus, createdAt, updatedAt }) {

    const expiry = expirationDate === null ? null : new Date(expirationDate);
    return new Batch({
      id,
      expiry,
      quantity,
      productID: product_id,
    });
  }
}