/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { performFetch, performFetchNoResult } from "../apiBase";
import { ENTITIES, getData, updateData } from "../utils/debug-local-helper";
import { DEBUG_LOCAL } from "../App";

export default function useCategory() {
  const [products, setProducts] = useState([]);

  const [errorInsert, setErrorInsert] = useState(null);

  //* snackBar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [autoHideSnackBar, setAutoHideSnackBar] = useState(3000);
  const [severitySnackBar, setSeveritySnackBar] = useState("info");
  const [snackMessageSnackBar, setSnackMessageSnackBar] = useState("");

  function handleOpenSnackBar(severity, message="Unexpected Error Occurred", autoHide=3000) {
    setSnackMessageSnackBar(message);
    setSeveritySnackBar(severity);
    setAutoHideSnackBar(autoHide);
    setOpenSnackBar(true);
  }

  function handleCloseSnackBar() {
    setOpenSnackBar(false);
  }

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    if(DEBUG_LOCAL) {
      const products = getData(ENTITIES.PRODUCTS);
      return setProducts(products);
    }
    try {
      const products = await performFetch("/products", {method: 'GET'});

      setProducts(products);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function createProduct(product) {
    if(DEBUG_LOCAL) {
      const nextProducts = [...products, product];

      setProducts(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }
    try {
      const prod = await performFetch("/products/new", {method: 'POST', body: JSON.stringify(product)});


      const productss = [...products, prod]
      setProducts(productss);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function updateProduct(product) {
    if(DEBUG_LOCAL) {
      const nextProducts = products.map(p => (p.id === product.id ? {...product} : {...p}));

      setProducts(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }

    try {
      await performFetchNoResult("/products/update", {method: 'PUT', body: JSON.stringify(product)});
      const newProducts = products.map(p => (p.id === product.id ? {...product} : {...p}));

      setProducts(newProducts);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete product by id
   * @param {*} id 
   */
  async function handleDeleteProduct(id) {
    if(DEBUG_LOCAL) {
      const nextProducts = products.filter(cat => cat.id !== id.product_id);

      setProducts(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }

    const url = "/products/delete";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
      .then(() => {
        const updatedProducts = products.filter(cat => cat.id !== id.product_id);
        setProducts(updatedProducts);
      })
      .catch(e => handleOpenSnackBar("error", e.message, 3500));
  }

  return {
    products, setProducts,
    createProduct, updateProduct,
    errorInsert, handleDeleteProduct,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar
  }
}