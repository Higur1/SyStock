import Batch from "../../classes/Batch";
import HTTPClient from "../../utils/HTTPClient";
import BatchMappers from "./Mappers/BatchMappers";


export default class BatchActions {
  static mapper = new BatchMappers();

  static async getAll() {
    const Client = new HTTPClient("/batchs");

    return Client.get()
      .then(dataObj => {
        return dataObj.batchs.map(this.mapper.toInterface);
      })
  }

  static async getByProduct(productID) {
    const Client = new HTTPClient(`/batch/product/${productID}`);

    return Client.get().then(response => this.mapper.toInterface(response.batch));
  }

  static async getBySupplier(supplyID) {
    const Client = new HTTPClient(`/batch/supplier/${supplyID}`);

    return Client.get().then(response => this.mapper.toInterface(response.batch));
  }

  static async update(batch = new Batch({})) {
    const Client = new HTTPClient("/batch");

    return Client.put(this.mapper.toServer(batch))
      .then(response => this.mapper.toInterface(response.batch));
  }
}