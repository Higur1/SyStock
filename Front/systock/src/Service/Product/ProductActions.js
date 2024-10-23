import Product from "../../classes/Product";
import HTTPClient from "../../utils/HTTPClient";
import CategoryActions from "../Category/CategoryActions";
import ProductMappers from "./Mappers/ProductMappers";


export default class ProductActions {
  static mapper = new ProductMappers();

  static async getAll() {
    const Client = new HTTPClient("/products");

    const categories = await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.products.map(products => this.mapper.toInterface(products, {categories}));
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  static async create(supp = new Product({})) {
    const Client = new HTTPClient("/product");

    try {
      const nextProduct = await Client.post(this.mapper.toServer(supp)).then(response => response.product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, {category});
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async getById(id) {
    const Client = new HTTPClient(`/product/${id}`);
    try {
      const nextProduct = await Client.get().then(response => response.product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, {category});
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async update(sup = new Product({})) {
    const Client = new HTTPClient("/product");
    try {
      const nextProduct = Client.put(this.mapper.toServer(sup, "PUT")).then(response => response.product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, {category});
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async delete(id) {
    const Client = new HTTPClient("/product");

    return Client.delete({id});
  }

  static async addMultipleQuantityProducts(productsToAdd = []) {

    const results = await Promise.all(productsToAdd.map(this.update));

    return results;
  }
}