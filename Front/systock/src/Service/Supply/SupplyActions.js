import Batch from "../../classes/Batch";
import Supply from "../../classes/Supply";
import HTTPClient from "../../utils/HTTPClient";
import SupplierActions from "../Supplier/SupplierActions";
import SupplyMappers from "./Mappers/SupplyMappers";


export default class SupplyActions {
  static mapper = new SupplyMappers();

  static async getAll() {
    const Client = new HTTPClient("/fill");
    
    const suppliers = await SupplierActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Mesage.map(response => this.mapper.toInterface(response, suppliers));
      })
  }

  static async getBySupplier(supplyID) {
    const Client = new HTTPClient(`/fill/findBySupplierName`);

    return Client.get({}, `/${supplyID}`).then(response => this.mapper.toInterface(response.batch));
  }

  static async create(supply = new Supply()) {
    const Client = new HTTPClient("/fill");

    return Client.post(this.mapper.toServer(supply));
  }
}