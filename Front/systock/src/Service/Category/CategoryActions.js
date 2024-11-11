import Category from "../../classes/Category";
import HTTPClient from "../../utils/HTTPClient";
import CategoryMappers from "./Mappers/CategoryMappers";
import CategoryValidations from "./Validations/CategoryValidations";


export default class CategoryActions {
  static mapper = new CategoryMappers();

  static async getAll() {
    const Client = new HTTPClient("/categories");

    return Client.get()
      .then(dataObj => {
        return dataObj.Categories.map(this.mapper.toInterface);
      })
  }

  static async create(cat = new Category({})) {
    const Client = new HTTPClient("/category");

    const errorValidation = CategoryValidations(cat);
    if(errorValidation !== null) return Promise.reject(errorValidation);

    return Client.post(this.mapper.toServer(cat))
      .then(response => this.mapper.toInterface(response.Category));
  }

  static async getById(id) {
    const Client = new HTTPClient(`/category`);

    return Client.get({}, `/${id}`).then(response => this.mapper.toInterface(response.Category));
  }

  static async update(cat = new Category({})) {
    const Client = new HTTPClient("/category");

    const errorValidation = CategoryValidations(cat);
    if(errorValidation !== null) return Promise.reject(errorValidation);

    return Client.put(this.mapper.toServerPut(cat))
      .then(response => this.mapper.toInterface(response.Category));
  }

  static async delete({id}) {
    const Client = new HTTPClient(`/category`);

    return Client.delete({}, `/${id}`);
  }
}