import Supplier from "../../classes/Supplier";
import HTTPClient from "../../utils/HTTPClient";
import SupplierMappers from "./Mappers/SupplierMappers";


export default class SupplierActions {
  static mapper = new SupplierMappers();

  static async getAll() {
    const Client = new HTTPClient("/suppliers");

    return Client.get()
      .then(dataObj => {
        if(!dataObj?.Suppliers?.suppliers) return [];
        return dataObj.Suppliers.suppliers.map(this.mapper.toInterface).filter(obj => obj.id !== 1);
      })
  }

  static async create(supp = new Supplier({})) {
    const Client = new HTTPClient("/supplier");

    return Client.post(this.mapper.toServer(supp)).then(response => this.mapper.toInterface(response.Supplier));
  }

  static async getById(id) {
    const Client = new HTTPClient(`/supplier`);

    return Client.get({}, `/${id}`).then(response => this.mapper.toInterface(response.Supplier));
  }

  static async update(sup = new Supplier({})) {
    const Client = new HTTPClient("/supplier");

    return Client.put(this.mapper.toServer(sup))
      .then(response => this.mapper.toInterface(response.Supplier));
  }

  static async delete(id) {
    const Client = new HTTPClient(`/supplier`);

    return Client.delete({}, `/${id}`);
  }
}