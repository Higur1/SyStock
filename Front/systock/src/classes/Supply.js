
/**
 * Represents a Supply with batches and a description.
 */
export default class Supply {
  /**
   * Creates an instance of Supply.
   * @param {Object} options - The options for the Supply instance.
   * @param {Batch[]} [options.batches=[]] - An array of Batch instances associated with the supply.
   * @param {string} [options.description=""] - The description of the supply.
   * @param {String} [options.totalValue="0"] - The total of the supply.
   * @param {String} [options.dateInsert=""] - The total of the supply.
   * @param {Number} [options.id=0] - The total of the supply.
   * @param {Supplier|null} [options.supplier=null] - The supplier of the supply;
   * @param {number} [options.supplierID=0] - The supplier;
   */
  constructor({ id = 0, batches = [], description = "", supplier = null, totalValue = "0", supplierID = 0, dateInsert = new Date().toString() } = {}) {
    this.id = id;
    this.supplierID = supplierID;
    this.dateInsert = dateInsert;
    /**
     * An array of Batch instances.
     * @type {Batch[]}
     */
    this.batches = batches;

    /**
     * The description of the supply.
     * @type {string}
     */
    this.description = description;

    /**
     * The supplier.
     * @type {Supplier|null}
     */
    this.supplier = supplier;

    /**
     * The description of the supply.
     * @type {Number}
     */
    this.totalValue = totalValue;
  }

  /**
   * Calculates the total value of all batches in the supply.
   * @returns {number} The total value of all batches.
   */
  getTotalValue() {
    try {
      const arr = this.batches.map(batch => batch.getSubTotal());
      const sum = arr.reduce((accumulator, batch) => {
        return accumulator + batch;
      }, 0);

      return sum;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Filters out batches with zero quantity.
   * @returns {Batch[]} An array of Batch instances with zero quantity.
   */
  getBatchesEmpty() {
    return this.batches.filter(batch => batch.quantity === 0);
  }

  /**
   * Filters out batches with quantities less than minimum quantity
   * @returns {Batch[]} An array of Batch instances with quantities less than minimum quantity.
   */
  getBatchesEnding() {
    return this.batches.filter(batch => batch.quantity < batch.minimumQuantity);
  }

  /**
   * Filters out batches expired.
   * @returns {Batch[]} An array of Batch instances expired.
   */
  getBatchesExpired() {
    return this.batches.filter(batch => batch.expiry !== null && batch.expiry <= new Date());
  }

  /**
   * Filters out batches next to expire.
   * @returns {Batch[]} An array of Batch instances next to expire.
   */
  getBatchesNextToExpire(daysDiff = 7) {
    const nextDay = new Date();
    nextDay.setDate(new Date().getDate() + daysDiff);

    return this.batches.filter(batch => batch.expiry !== null && (nextDay - batch.expiry) < daysDiff);
  }
}