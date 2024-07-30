import { accounts, products, suppliers } from "./data";

const DB_DEBUG_NAME = "db-local-debug";

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
export function getDB() {
  const db = window.localStorage.getItem(DB_DEBUG_NAME);

  return JSON.parse(db);
}
// dblocal = { products, categories, suppliers, accounts };

export const ENTITIES = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  SUPPLIERS: "suppliers",
  ACCOUNTS: "accounts",
  HOME_PAGE: "homepage"
};

export function setInitialData() {
  const catArr = products.filter(obj => obj.category);
  const categories = catArr.filter((obj,i) => catArr.findIndex(o => o === obj) === i);
  const homepage = { adviceQuantity: 0 };

  const data = { products, categories, suppliers, accounts, homepage };

  window.localStorage.setItem(DB_DEBUG_NAME, JSON.stringify(data));
}

export function updateData(type, value) {
  if(!verifyHasContent()) return;

  const db = getDB();

  const nextDB = {...db, [type]: value};

  window.localStorage.setItem(DB_DEBUG_NAME, JSON.stringify(nextDB));
}

export function getData(type) {
  if(!verifyHasContent()) return;

  const db = getDB();

  return db[type];
}