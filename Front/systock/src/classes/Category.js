import { generateID } from "../utils/utils";

/**
 * Represents a Category with an ID and a name.
 */
export default class Category {
  /**
    * @param {Object} options - The options for.
   * @param {string} [options.id=""] - The id of the category.
   * @param {string} [options.name=""] - The name of the category.
   */
  constructor({id = Math.random().toString().slice(2), name = ""} = {}) {
    /**
     * A unique identifier for the category.
     * @type {string}
     */
    this.id = id;

    /**
     * The name of the category.
     * @type {string}
     */
    this.name = name;
  }
}