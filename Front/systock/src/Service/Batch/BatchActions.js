import Batch from "../../classes/Batch";
import HTTPClient from "../../utils/HTTPClient";
import BatchMappers from "./Mappers/BatchMappers";


export default class BatchActions {
  static mapper = new BatchMappers();

  static async getAll() {
    const Client = new HTTPClient("/batchs");

    return Client.get()
      .then(dataObj => {
        return dataObj.Batchs.map(this.mapper.toInterface);
      })
  }

  static async getByProduct(productID) {
    const Client = new HTTPClient(`/batch/product/${productID}`);

    return Client.get().then(response => {
      return response.Batchs.map(this.mapper.toInterface)
    });
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

  static async create(batch = new Batch({})) {
    const Client = new HTTPClient("/batch");

    return Client.post(this.mapper.toServerCreate(batch))
      .then(response => this.mapper.toInterface(response.batch));
  }

  static async decreaseQuantity(obj = { product_id: 0, expirationDate: new Date().toString(), quantity: 0 }) {
    const Client = new HTTPClient("/batch/subQuantity");

    return Client.post(obj);
  }

  static async addQuantity(batch = new Batch({})) {
    const Client = new HTTPClient("/batch/addQuantity");

    return Client.post(this.mapper.toServerCreate(batch))
      .then(response => this.mapper.toInterface(response.batch));
  }

  static async addMultipleQuantityProducts(productsToAdd = []) {

    const results = await Promise.all(productsToAdd.map(batch => BatchActions.addQuantity(batch)));

    if (results.every(result => result instanceof Batch)) return Promise.result();
    return Promise.reject(results.some(result => typeof result === "string"));
  }
}