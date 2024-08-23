import Product from "./Product";

/**
 * Represents a Batch of a Product with additional attributes for pricing and quantity.
 * @extends Product
 */
export default class Batch extends Product {
  /**
   * Creates an instance of Batch.
   * @param {Object} options - The options for the Batch instance.
   * @param {Product} [options.product=new Product()] - The product associated with this batch.
   * @param {number} [options.priceBuy=0] - The buying price of the batch.
   * @param {number} [options.priceSell=0] - The selling price of the batch.
   * @param {number} [options.quantity=0] - The quantity of the product in the batch.
   * @param {Date|null} [options.expiry=null] - The expiry date of the batch, or null if not applicable.
   * @param {Supplier|null} [options.supplier=null] - The supplier;
   */
  constructor({ product = new Product(), priceBuy = 0, priceSell = 0, quantity = 0, expiry = null, supplier = null } = {}) {
    super(product);
    
    /**
     * The buying price of the batch.
     * @type {number}
     */
    this.priceBuy = priceBuy;

    /**
     * The selling price of the batch.
     * @type {number}
     */
    this.priceSell = priceSell;

    /**
     * The quantity of the product in the batch.
     * @type {number}
     */
    this.quantity = quantity;

    /**
     * The expiry date of the batch.
     * @type {Date|null}
     */
    this.expiry = expiry;

    /**
     * The supplier.
     * @type {Supplier|null}
     */
    this.supplier = supplier;

  }

  

  expiryToString() {
    if(this.expiry === null) return "";

    const date = new Date(this.expiry);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formatDate = `${day}/${month}/${year}`;

    return formatDate;
  }

  getSubTotal() {
    return this.quantity * this.priceBaseBuy;
  }

  setSupplier(supplier) {
    this.supplier = supplier;
  }
}