import HTTPClient from "../../utils/HTTPClient";
import HistoryMappers from "./Mappers/HistoryMappers";

export default class HistoryActions {
  static mapper = new HistoryMappers();

  static async getAllProductMovement () {
    const Client = new HTTPClient("/history");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
  }

  static async getAllSupply () {
    const Client = new HTTPClient("/history");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
  }

  static async getAllSales () {
    const Client = new HTTPClient("/history");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
  }
}