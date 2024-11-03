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
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  static async getAllSupply () {
    const Client = new HTTPClient("/history");

    return Client.get()
      .then(dataObj => {
        return dataObj.history.map(history => this.mapper.toInterface(history));
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  static async getAllSales () {
    const Client = new HTTPClient("/history");

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