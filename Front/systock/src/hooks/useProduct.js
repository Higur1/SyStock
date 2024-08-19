/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { performFetch, performFetchNoResult } from "../apiBase";
import { ENTITIES, getData, updateData } from "../utils/debug-local-helper";
import { DEBUG_LOCAL } from "../App";
import { FILTER_TYPES } from "../pages/Product/Product";

export default function useCategory() {
  const [productsBase, setProductsBase] = useState(null);
  const [productsFiltered, setProductsFiltered] = useState(null);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);

  const [errorInsert, setErrorInsert] = useState(null);

  //* snackBar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [autoHideSnackBar, setAutoHideSnackBar] = useState(3000);
  const [severitySnackBar, setSeveritySnackBar] = useState("info");
  const [snackMessageSnackBar, setSnackMessageSnackBar] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  function setFilteredProducts(products = productsBase, filterBase = filter) {
    console.log(filterBase);

    let nextProducts = products;
    if (filterBase === FILTER_TYPES.LOW_QUANTITY) nextProducts = nextProducts.filter(product => product.quantity < 20);
    if (filterBase === FILTER_TYPES.EMPTY) nextProducts = nextProducts.filter(product => product.quantity === 0);
    if (filterBase === FILTER_TYPES.EXPIRED) nextProducts = nextProducts.filter(product => new Date(product.expiry) <= new Date());
    if (filterBase === FILTER_TYPES.NEXT_TO_EXPIRY) {
      const daysDiff = 7;
      const nextDay = new Date();
      nextDay.setDate(new Date().getDate() + daysDiff);

      nextProducts = nextProducts.filter(product => (nextDay - new Date(product.expiry)) < daysDiff);
    }

    console.log(nextProducts);

    setProductsFiltered(nextProducts);
  }


  function handleOpenSnackBar(severity, message = "Unexpected Error Occurred", autoHide = 3000) {
    setSnackMessageSnackBar(message);
    setSeveritySnackBar(severity);
    setAutoHideSnackBar(autoHide);
    setOpenSnackBar(true);
  }


  function handleCloseSnackBar() {
    setOpenSnackBar(false);
  }



  async function getProducts() {
    if (DEBUG_LOCAL) {
      const products = getData(ENTITIES.PRODUCTS);
      setFilteredProducts(products);
      return setProductsBase(products);
    }
    try {
      const products = await performFetch("/products", { method: 'GET' });
      setFilteredProducts(products);
      setProductsBase(products);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function createProduct(product) {
    if (DEBUG_LOCAL) {
      const nextProducts = [...productsBase, product];

      setFilteredProducts(nextProducts);
      setProductsBase(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }
    try {
      const prod = await performFetch("/products/new", { method: 'POST', body: JSON.stringify(product) });


      const productss = [...productsBase, prod]
      setFilteredProducts(productss);
      setProductsBase(productss);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function updateProduct(product) {
    if (DEBUG_LOCAL) {
      const nextProducts = productsBase.map(p => (p.refCode === product.refCode ? { ...product } : { ...p }));

      setProductsBase(nextProducts);
      setFilteredProducts(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }

    try {
      await performFetchNoResult("/products/update", { method: 'PUT', body: JSON.stringify(product) });
      const newProducts = productsBase.map(p => (p.refCode === product.refCode ? { ...product } : { ...p }));

      setProductsBase(newProducts);
      setFilteredProducts(newProducts);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete product by id
   * @param {*} id 
   */
  async function handleDeleteProduct(id) {
    if (DEBUG_LOCAL) {
      const nextProducts = productsBase.filter(cat => cat.id !== id.product_id);

      setFilteredProducts(nextProducts);
      setProductsBase(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }

    const url = "/products/delete";

    performFetchNoResult(url, { method: 'DELETE', body: JSON.stringify(id) })
      .then(() => {
        const updatedProducts = productsBase.filter(cat => cat.id !== id.product_id);
        setFilteredProducts(updatedProducts);
        setProductsBase(updatedProducts);
      })
      .catch(e => handleOpenSnackBar("error", e.message, 3500));
  }

  function handleFilter(value) {
    setFilter(value);
    console.log(value, typeof value);
    setFilteredProducts(productsBase, value);
  }

  return { productsBase,
    productsFiltered, filter, handleFilter,
    createProduct, updateProduct,
    errorInsert, handleDeleteProduct,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar
  }
}