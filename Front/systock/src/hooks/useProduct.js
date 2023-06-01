/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { performFetch } from "../apiBase";

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
    try {
      const products = await performFetch("/products", {method: 'GET'});

      setProducts(products);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function createProduct(product) {
    try {
      const prod = await performFetch("/products/new", {method: 'POST', body: JSON.stringify(product)});

      setProducts(prod);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function updateProduct(product) {
    try {
      const prod = await performFetch("/products/update", {method: 'POST', body: JSON.stringify(product)});

      const newProducts = products.map(p => (p.id === prod.id ? {...prod} : {...p}));

      setProducts(newProducts);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  return {
    products, setProducts,
    createProduct, updateProduct,
    errorInsert,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar
  }
}