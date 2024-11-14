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
   * @param {number} [options.supplierID=0] - The supplier;
   * @param {number} [options.productID=0] - The supplier;
   */
  constructor({ product = new Product(), id = 0, priceBuy = 0, priceSell = 0, quantity = 0, expiry = null, supplier = null, supplierID = 0, productID = 0 } = {}) {
    super(product);
    this.id = id;
    this.supplierID = supplierID;
    this.productID = productID;
    
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

export class Batch2 {
  /**
   * Creates an instance of Batch.
   * @param {Object} options - The options for the Batch instance.
   * @param {Number} [options.id= 0] - The id of this batch.
   * @param {Product} [options.product=new Product()] - The product associated with this batch.
   * @param {Date|null} [options.expiry=null] - The expiry date of the batch, or null if not applicable.
   * @param {Boolean} [options.deleteStatus=false] - The deleteStatus;
   * @param {Number} [options.validateStatus=0] - The validateStatus;
   */
  constructor({ id = 0, expiry = null, deleteStatus = false, product = new Product(), validateStatus = 0 } = {}) {
    /**
     * The buying price of the batch.
     * @type {Number}
     */
    this.id = id;

    /**
     * The expiry date of the batch.
     * @type {Date|null}
     */
    this.expiry = expiry;

    /**
     * delete Status.
     * @type {Boolean}
     */
    this.deleteStatus = deleteStatus;

    /**
     * product related.
     * @type {Product|null}
     */
    this.product = product;

    /**
     * valdiate Status.
     * @type {Number}
     */
    this.validateStatus = validateStatus;
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
}