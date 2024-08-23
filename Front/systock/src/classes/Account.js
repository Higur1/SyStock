/**
 * Represents an Account with a user and password.
 */
export default class Account {
  /**
   * Creates an instance of Account.
   * @param {Object} options - The options for the Account instance.
   * @param {string} [options.user=""] - The username for the account.
   * @param {string} [options.password=""] - The password for the account.
   */
  constructor({ user = "", password = "" } = {}) {
    /**
     * @type {string}
     */
    this.user = user;

    /**
     * @type {string}
     */
    this.password = password;
  }
}
