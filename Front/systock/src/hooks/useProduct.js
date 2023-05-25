/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { performFetch } from "../apiBase";

export default function useCategory() {
  const [products, setProducts] = useState([]);


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

  return {
    products, setProducts
  }
}