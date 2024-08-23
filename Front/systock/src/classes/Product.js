import Category from "./Category";

/**
 * Represents a Product with various attributes.
 */
export default class Product {
  /**
   * Creates an instance of Product.
   * @param {Object} options - The options for the Product instance.
   * @param {string} [options.name=""] - The name of the product.
   * @param {string} [options.refCode=""] - The reference code of the product.
   * @param {Category|null} [options.category=null] - The category of the product, or null if not assigned.
   * @param {number} [options.priceBaseSell=0] - The base selling price of the product.
   * @param {number} [options.priceBaseBuy=0] - The base buying price of the product.
   * @param {number} [options.minimumQuantity=0] - The minimum quantity required for the product.
   * @param {string} [options.description=""] - The description of the product.
   */
  constructor({ name = "", refCode = "", category = null, priceBaseSell = 0, priceBaseBuy = 0, minimumQuantity = 0, description = "" } = {}) {
    /**
     * The name of the product.
     * @type {string}
     */
    this.name = name;

    /**
     * The reference code of the product.
     * @type {string}
     */
    this.refCode = refCode;

    /**
     * The category of the product.
     * @type {Category|null}
     */
    this.category = category;

    /**
     * The base selling price of the product.
     * @type {number}
     */
    this.priceBaseSell = priceBaseSell;

    /**
     * The base buying price of the product.
     * @type {number}
     */
    this.priceBaseBuy = priceBaseBuy;

    /**
     * The minimum quantity required for the product.
     * @type {number}
     */
    this.minimumQuantity = minimumQuantity;

    /**
     * The description of the product.
     * @type {string}
     */
    this.description = description;
  }
}