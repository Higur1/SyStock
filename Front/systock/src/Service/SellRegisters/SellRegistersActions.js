import HTTPClient from "../../utils/HTTPClient";
import SellRegistersMappers from "./Mappers/SellRegistersMappers";
import HistoryMappers from "./Mappers/SellRegistersMappers";

export default class SellRegistersActions {
  static mapper = new SellRegistersMappers();

  static async getAllProductMovement () {
    const Client = new HTTPClient("/sellRegisters");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
  }

  static async getAllClosingList () {
    const Client = new HTTPClient("/closingList");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
  }
}