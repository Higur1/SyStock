import Category from "../../classes/Category";
import HTTPClient from "../../utils/HTTPClient";
import CategoryMappers from "./Mappers/CategoryMappers";


export default class CategoryActions {
  static mapper = new CategoryMappers();

  static async getAll() {
    const Client = new HTTPClient("/categories");

    return Client.get()
      .then(dataObj => {
        return dataObj.categories.map(this.mapper.toInterface);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  static async create(cat = new Category({})) {
    const Client = new HTTPClient("/category");

    return Client.post(this.mapper.toServer(cat)).then(this.mapper.toInterface);
  }

  static async getById(id) {
    const Client = new HTTPClient(`/category/${id}`);

    return Client.get().then(response => this.mapper.toInterface(response.category));
  }

  static async update(cat = new Category({})) {
    const Client = new HTTPClient("/category");

    return Client.put(this.mapper.toServerPut(cat))
      .then(response => this.mapper.toInterface(response.category));
  }

  static async delete(id) {
    const Client = new HTTPClient("/funcionario");

    return Client.delete({id});
  }
}