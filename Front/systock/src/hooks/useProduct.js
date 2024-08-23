/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { performFetch, performFetchNoResult } from "../apiBase";
import { ENTITIES } from "../utils/debug-local-helper";
import { DEBUG_LOCAL, MainContext } from "../App";
import { FILTER_TYPES } from "../pages/Product/Product";
import { convertMsToDay } from "../utils/utils";

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

  const { updateData, getData } = useContext(MainContext);

  useEffect(() => {
    getProducts();
  }, []);

  function setFilteredProducts(products = productsBase, filterBase = filter) {

    let nextProducts = [];
    if (filterBase === FILTER_TYPES.LOW_QUANTITY) {
      nextProducts = products.filter(batch => batch.quantity < batch.minimumQuantity);
    }
    if (filterBase === FILTER_TYPES.EMPTY) {
      nextProducts = products.filter(batch => batch.quantity === 0);
    }
    if (filterBase === FILTER_TYPES.EXPIRED) {
  
      const filteredProducts = products.filter(batch => batch.expiry !== null && (new Date(batch.expiry) - new Date()) < 0);

      
      for(let i = 0; i < filteredProducts.length; i++) {
        const currentProduct = filteredProducts[i];

        const productInsideNextProducts= nextProducts.find(prod => prod.refCode === currentProduct.refCode && prod.expiryToString() === currentProduct.expiryToString());

        if(productInsideNextProducts) continue;

        const equalProducts = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const equalProductsSameSupply = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode && prod.expiryToString() === currentProduct.expiryToString()).map(prod => prod.quantity);
        
        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });
        const totalQuantitySameExpiry = equalProductsSameSupply.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({...currentProduct, totalQuantity, totalQuantitySameExpiry});
      }
    }
    if (filterBase === FILTER_TYPES.NEXT_TO_EXPIRY) {

      const daysDiff = 7;
      const nextDay = new Date();
      nextDay.setDate(new Date().getDate() + daysDiff);
  
      const filteredProducts = products.filter(batch => batch.expiry !== null && (convertMsToDay(new Date(batch.expiry) - nextDay) < daysDiff));

      
      for(let i = 0; i < filteredProducts.length; i++) {
        const currentProduct = filteredProducts[i];

        const productInsideNextProducts= nextProducts.find(prod => prod.refCode === currentProduct.refCode && prod.expiryToString() === currentProduct.expiryToString());

        if(productInsideNextProducts) continue;

        const equalProducts = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const equalProductsSameSupply = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode && prod.expiryToString() === currentProduct.expiryToString()).map(prod => prod.quantity);
        
        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });
        const totalQuantitySameExpiry = equalProductsSameSupply.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({...currentProduct, totalQuantity, totalQuantitySameExpiry});
      }
    }
    if(filterBase === FILTER_TYPES.ALL) {
      for(let i = 0; i < products.length; i++) {
        const currentProduct = products[i];

        const productInsideNextProducts= nextProducts.find(prod => prod.refCode === currentProduct.refCode);

        if(productInsideNextProducts) continue;

        const equalProducts = products.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({...currentProduct, totalQuantity});
      }
    }


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
      const supplies = getData(ENTITIES.SUPPLY_LIST);

      const products = [];
      supplies.forEach(supply => {
        products.push(...supply.batches);
      });

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
    setFilteredProducts(productsBase, value);
  }

  return { productsBase,
    productsFiltered, filter, handleFilter,
    createProduct, updateProduct,
    errorInsert, handleDeleteProduct,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar
  }
}