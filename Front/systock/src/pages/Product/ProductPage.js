import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Product from './Product';
import { MainContext } from '../../App';
import ProductActions from '../../Service/Product/ProductActions';
import CategoryActions from '../../Service/Category/CategoryActions';

export const FILTER_TYPES = {
  ALL: "ALL",
  NEXT_TO_EXPIRY: "NEXT_TO_EXPIRY",
  LOW_QUANTITY: "LOW_QUANTITY",
  EMPTY: "EMPTY",
  EXPIRED: "EXPIRED"
};

export const filtersBase = [
  { type: FILTER_TYPES.ALL, value: "Todos" },
  { type: FILTER_TYPES.NEXT_TO_EXPIRY, value: "Próximo do Vencimento" },
  { type: FILTER_TYPES.LOW_QUANTITY, value: "Baixa Quantidade" },
  { type: FILTER_TYPES.EMPTY, value: "Estoque Zerado" },
  { type: FILTER_TYPES.EXPIRED, value: "Vencidos" }
];


export const ProductContext = createContext();

export default function ProductPage() {

  const productsRef = useRef(null);
  const categoriesRef = useRef(null);
  const [listOfProducts, setListOfProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleOpenSnackBar } = useContext(MainContext);


  async function get(categoriesList = categoriesRef.current, filter = FILTER_TYPES.ALL) {
    switch (filter) {
      case FILTER_TYPES.EMPTY: return await ProductActions.getAllEmpty(categoriesList);
      case FILTER_TYPES.EXPIRED: return await ProductActions.getAllExpired(categoriesList);
      case FILTER_TYPES.LOW_QUANTITY: return await ProductActions.getAllLowQuantity(categoriesList);
      case FILTER_TYPES.NEXT_TO_EXPIRY: return await ProductActions.getAllCloseToExpiry(categoriesList);
      case FILTER_TYPES.ALL:
      default: return await ProductActions.getAll(categoriesList);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!categoriesRef.current) return;

    getProducts();
  }, [categoriesRef.current]);

  useEffect(() => {
    if (!productsRef.current) return;

    getList();
  }, [productsRef.current]);

  async function getCategories() {
    try {
      const categories = await CategoryActions.getAll();
      categoriesRef.current = categories;
    } catch (error) {
      handleOpenSnackBar("error", error);
    }
  }

  async function loadProducts() {
    setLoading(true);
    getProducts();
  }

  async function getProducts() {
    try {
      const products = await get();
      setBaseProducts(products);
    } catch (error) {
      setBaseProducts([]);
      handleOpenSnackBar("error", error, 3500);
    } finally {
      setLoading(false);
    }
  }

  function getList() {
    setListOfProducts(productsRef.current);
  }

  function setBaseProducts(nextlist) {
    productsRef.current = nextlist;
  }

  async function updateProduct(product) {
    const newProducts = productsRef.current.map(p => (p.refCode === product.refCode ? product : { ...p }));
    setBaseProducts(newProducts);
  }

  /**
   * * delete product by id
   * @param {*} id 
   */
  function handleDeleteProduct(id) {
    const updatedProducts = productsRef.current
      .filter(cat => cat.id !== id);

    setBaseProducts(updatedProducts);
  }

  return (
    <ProductContext.Provider
      value={{
        listOfProducts,
        updateProduct,
        handleDeleteProduct,
        loading,
        loadProducts,
        categories: categoriesRef.current
      }}
    >
      <Product />
    </ProductContext.Provider>
  )
}
