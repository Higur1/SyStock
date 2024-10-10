import Account from "../classes/Account";
import Batch from "../classes/Batch";
import Category from "../classes/Category";
import Product from "../classes/Product";
import Supplier from "../classes/Supplier";
import Supply from "../classes/Supply";
import { accounts, categories, products, suppliers, supplyList } from "./data";

export const DB_DEBUG_NAME = "db-local-debug";

/**
 * * return if db exists on session
 * @returns {Boolean}
 */
export function verifyHasContent() {
  const db = window.localStorage.getItem(DB_DEBUG_NAME);

  return db !== null;
}

/**
 * return db;
 * @returns {Object}
 */
export function getDBBase() {
  const db = window.localStorage.getItem(DB_DEBUG_NAME);

  const parsedDB = JSON.parse(db);

  const nextDB = {};

  nextDB.accounts = parsedDB.accounts.map(acc => new Account({...acc}));
  nextDB.categories = parsedDB.categories.map(acc => new Category({...acc}));

  const categoriesMap = new Map(nextDB.categories.map(cat => [cat.id, cat]));

  nextDB.suppliers = parsedDB.suppliers.map(sup => new Supplier({...sup}));
  nextDB.products = parsedDB.products.map(prod => new Product({...prod, category: categoriesMap.get(prod.category.id)}));
  
  const suppliersMap = new Map(nextDB.suppliers.map(cat => [cat.email, cat]));
  const productsMap = new Map(nextDB.products.map(cat => [cat.refCode, cat]));

  nextDB.supplyList = parsedDB.supplyList.map(supply => {
    const supplier = suppliersMap.get(supply.supplier.email);
    const batches = supply.batches.map(batch => new Batch({product: productsMap.get(batch.refCode), ...batch, supplier}));

    return new Supply({ batches, description: supply.description, supplier});
  });

  return nextDB;
}
// dblocal = { products, categories, suppliers, accounts };

export const ENTITIES = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  SUPPLIERS: "suppliers",
  ACCOUNTS: "accounts",
  SUPPLY_LIST: "supplyList"
};

export function setInitialData() {

  const data = { products, categories, suppliers, accounts, supplyList };

  window.localStorage.setItem(DB_DEBUG_NAME, JSON.stringify(data));
}