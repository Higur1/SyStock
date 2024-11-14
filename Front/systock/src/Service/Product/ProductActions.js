import Product from "../../classes/Product";
import HTTPClient from "../../utils/HTTPClient";
import CategoryActions from "../Category/CategoryActions";
import ProductMappers from "./Mappers/ProductMappers";


export default class ProductActions {
  static mapper = new ProductMappers();

  static async getAll(categoriesList = null) {
    const Client = new HTTPClient("/products");

    const categories = categoriesList ? categoriesList : await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Products.map(products => this.mapper.toInterface(products, { categories }));
      })
  }

  static async getAllExpired(categoriesList = null) {
    const Client = new HTTPClient("/products/expired");

    const categories = categoriesList ? categoriesList : await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Products.map(products => this.mapper.toInterface(products, { categories }));
      })
  }

  static async getAllEmpty(categoriesList = null) {
    const Client = new HTTPClient("/products/zeroStock");

    const categories = categoriesList ? categoriesList : await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Products.map(products => this.mapper.toInterface(products, { categories }));
      })
  }

  static async getAllLowQuantity(categoriesList = null) {
    const Client = new HTTPClient("/products/lowQuantity");

    const categories = categoriesList ? categoriesList : await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Products.map(products => this.mapper.toInterface(products, { categories }));
      })
  }

  static async getAllCloseToExpiry(categoriesList = null) {
    const Client = new HTTPClient("/products/closeToExpiration");

    const categories = categoriesList ? categoriesList : await CategoryActions.getAll();

    return Client.get()
      .then(dataObj => {
        return dataObj.Products.map(products => this.mapper.toInterface(products, { categories }));
      })
  }

  static async create(supp = new Product({})) {
    const Client = new HTTPClient("/product");

    try {
      const nextProduct = await Client.post(this.mapper.toServer(supp)).then(response => response.Product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, { category });
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async getById(id) {
    const Client = new HTTPClient(`/product/${id}`);
    try {
      const nextProduct = await Client.get().then(response => response.Product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, { category });
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async getBySupply(id) { ///! ESPERAR
    const Client = new HTTPClient(`/product/supply`);
    try {
      const nextProduct = await Client.get({}, `/${id}`).then(response => response.Product);


      return this.mapper.toInterface(nextProduct);
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async update(sup = new Product({})) {
    const Client = new HTTPClient("/product");
    try {
      const nextProduct = Client.put(this.mapper.toServer(sup, "PUT")).then(response => response.Product);

      const category = await CategoryActions.getById(nextProduct.category_id);

      return this.mapper.toInterface(nextProduct, { category });
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  static async delete(id) {
    const Client = new HTTPClient("/product");

    return Client.delete({}, `/${id}`);
  }

  static async addMultipleQuantityProducts(productsToAdd = []) {

    const results = await Promise.all(productsToAdd.map(product => ProductActions.update(product)));

    if(results.every(result => result instanceof Product)) return Promise.result();
    return Promise.reject(results.some(result => typeof result === "string"));
  }
}