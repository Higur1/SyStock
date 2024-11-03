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
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  static async getAllClosingList () {
    const Client = new HTTPClient("/closingList");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }
}