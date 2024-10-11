import Supplier from "../../classes/Supplier";
import HTTPClient from "../../utils/HTTPClient";
import SupplierMappers from "./Mappers/SupplierMappers";


export default class SupplierActions {
  static mapper = new SupplierMappers();

  async getAll() {
    const Client = new HTTPClient("/suppliers");

    return Client.get()
      .then(dataObj => {
        return dataObj.suppliers.map(this.mapper.toInterface);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  async post(supp = new Supplier({})) {
    const Client = new HTTPClient("/supplier");

    return Client.post(this.mapper.toServer(supp)).then(response => this.mapper.toInterface(response.supplier));
  }

  async getById(id) {
    const Client = new HTTPClient(`/supplier/${id}`);

    return Client.get().then(response => this.mapper.toInterface(response.supplier));
  }

  async put(sup = new Supplier({})) {
    const Client = new HTTPClient("/supplier");

    return Client.put(this.mapper.toServer(sup))
      .then(response => this.mapper.toInterface(response.supplier));
  }

  async delete(id) {
    const Client = new HTTPClient("/supplier");

    return Client.delete({id});
  }
}