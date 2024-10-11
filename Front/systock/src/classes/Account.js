/**
 * Represents an Account with a user and password.
 */
export default class Account {
  /**
   * Creates an instance of Account.
   * @param {Object} options - The options for the Account instance.
   * @param {Number} [options.id=""] - The username for the account.
   * @param {string} [options.name=""] - The username for the account.
   * @param {string} [options.user=""] - The username for the account.
   * @param {string} [options.password=""] - The password for the account.
   * @param {string} [options.email=""] - The email for the account.
   */
  constructor({ id = 0, name = "", user = "", password = "", email = "" } = {}) {

    /**
     * @type {Number}
     */
    this.id = id;

    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {string}
     */
    this.user = user;

    /**
     * @type {string}
     */
    this.password = password;

    /**
     * @type {string}
     */
    this.email = email;
  }
}
