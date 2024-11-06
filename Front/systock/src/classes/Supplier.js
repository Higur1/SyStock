/**
 * Represents a Supplier with contact details.
 */
export default class Supplier {
  /**
   * Creates an instance of Supplier.
   * @param {Object} options - The options for the Supplier instance.
   * @param {Number | null} [options.id=""] - The id of the supplier.
   * @param {string} [options.name=""] - The name of the supplier.
   * @param {string} [options.phone=""] - The phone number of the supplier.
   * @param {string} [options.email=""] - The email address of the supplier.
   */
  constructor({ id = null, name = "", phone = "", email = "" } = {}) {
    this.id = id;
    /**
     * The name of the supplier.
     * @type {string}
     */
    this.name = name;

    /**
     * The phone number of the supplier.
     * @type {string}
     */
    this.phone = phone;

    /**
     * The email address of the supplier.
     * @type {string}
     */
    this.email = email;
  }
}
