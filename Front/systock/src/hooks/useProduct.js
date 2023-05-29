/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { performFetch } from "../apiBase";

export default function useCategory() {
  const [products, setProducts] = useState([]);

  const [errorInsert, setErrorInsert] = useState(null);


  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const products = await performFetch("/products", {method: 'GET'});

      setProducts(products);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createProduct(product) {
    try {
      const prod = await performFetch("/products/new", {method: 'POST', body: JSON.stringify(product)});

      setProducts(prod);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function updateProduct(product) {
    try {
      const prod = await performFetch("/products/update", {method: 'POST', body: JSON.stringify(product)});

      const newProducts = products.map(p => (p.id === prod.id ? {...prod} : {...p}));

      setProducts(newProducts);
    } catch (error) {
      console.log(error.message);
    }
  }

  return {
    products, setProducts,
    createProduct, updateProduct,
    errorInsert
  }
}