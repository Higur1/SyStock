import React, { createContext, useContext, useEffect, useState } from 'react'
import Product from './Product';
import { DEBUG_LOCAL, MainContext } from '../../App';
import { FILTER_TYPES } from './tabs/productList';
import { convertMsToDay, extraDateToString } from '../../utils/utils';
import { ENTITIES } from '../../utils/debug-local-helper';
import { SuperArray } from '../../utils/arrayFunctions';
import ProductActions from '../../Service/Product/ProductActions';

export const ProductContext = createContext();

export default function ProductPage() {

  const [productsWithoutSupply, setProductsWithoutSupply] = useState([]);
  const [productsBase, setProductsBase] = useState(null);
  const [productsFiltered, setProductsFiltered] = useState(null);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [loading, setLoading] = useState(true);

  const [errorInsert, setErrorInsert] = useState(null);

  const [productsListAutoComplete, setProductsListAutoComplete] = useState([]);

  const { updateData, getData, handleOpenSnackBar } = useContext(MainContext);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if(productsFiltered === null) return;

    setLoading(false);
  }, [productsFiltered]);

  function setFilteredProducts(products = productsBase, filterBase = filter) {

    let nextProducts = [];
    if (filterBase === FILTER_TYPES.LOW_QUANTITY) {
      nextProducts = products.filter(batch => batch.quantity < batch.minimumQuantity);
    }
    if (filterBase === FILTER_TYPES.EMPTY) {
      const nextProductsWithoutSupply = productsWithoutSupply.filter(prod => !(products.some(batch => batch.refCode === prod.refCode)));
      nextProducts = [...products.filter(batch => batch.quantity === 0), ...nextProductsWithoutSupply];
    }
    if (filterBase === FILTER_TYPES.EXPIRED) {

      const filteredProducts = products.filter(batch => batch.expiry !== null && (new Date(batch.expiry) - new Date()) < 0);

      for (let i = 0; i < filteredProducts.length; i++) {
        const currentProduct = filteredProducts[i];

        const productInsideNextProducts = nextProducts.find(prod => prod.refCode === currentProduct.refCode && (extraDateToString(prod.expiry)) === (extraDateToString(currentProduct.expiry)));

        if (productInsideNextProducts) continue;

        const equalProducts = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const equalProductsSameSupply = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode && (extraDateToString(prod.expiry)) === (extraDateToString(currentProduct.expiry))).map(prod => prod.quantity);

        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });
        const totalQuantitySameExpiry = equalProductsSameSupply.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({ ...currentProduct, totalQuantity, totalQuantitySameExpiry });
      }
    }
    if (filterBase === FILTER_TYPES.NEXT_TO_EXPIRY) {

      const daysDiff = 7;
      const nextDay = new Date();
      nextDay.setDate(new Date().getDate() + daysDiff);

      const filteredProducts = products.filter(batch => batch.expiry !== null && (convertMsToDay(new Date(batch.expiry) - nextDay) < daysDiff));


      for (let i = 0; i < filteredProducts.length; i++) {
        const currentProduct = filteredProducts[i];

        const productInsideNextProducts = nextProducts.find(prod => prod.refCode === currentProduct.refCode && (extraDateToString(prod.expiry)) === (extraDateToString(currentProduct.expiry)));

        if (productInsideNextProducts) continue;

        const equalProducts = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const equalProductsSameSupply = filteredProducts.filter((prod, index) => prod.refCode === currentProduct.refCode && (extraDateToString(prod.expiry)) === (extraDateToString(currentProduct.expiry))).map(prod => prod.quantity);

        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });
        const totalQuantitySameExpiry = equalProductsSameSupply.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({ ...currentProduct, totalQuantity, totalQuantitySameExpiry });
      }
    }
    if (filterBase === FILTER_TYPES.ALL) {
      for (let i = 0; i < products.length; i++) {
        const currentProduct = products[i];

        const productInsideNextProducts = nextProducts.find(prod => prod.refCode === currentProduct.refCode);

        if (productInsideNextProducts) continue;

        const equalProducts = products.filter((prod, index) => prod.refCode === currentProduct.refCode).map(prod => prod.quantity);
        const totalQuantity = equalProducts.reduce((acumulator, prod) => {
          const total = prod + acumulator;
          return acumulator + total;
        });

        nextProducts.push({ ...currentProduct, totalQuantity });
      }
    }


    setProductsFiltered(nextProducts);
  }

  function getProductTotalQuantity(refCode) {
    try {
      const productsQuantity = productsBase.filter(batch => batch.refCode === refCode).map(batch => batch.quantity);
      const totalQuantity = productsQuantity.reduce((acumulator, prod) => {
        const total = prod + acumulator;
        return acumulator + total;
      });

      return totalQuantity;
    } catch {
      return 0;
    }
  }

  async function getProducts() {
    if (DEBUG_LOCAL) {
      const supplies = getData(ENTITIES.SUPPLY_LIST);
      const productsData = getData(ENTITIES.PRODUCTS); 

      const products = [];
      supplies.forEach(supply => {
        products.push(...supply.batches);
      });

      setProductsWithoutSupply(productsData);
      setProductsListAutoComplete(productsData.map((prod) => ({ label: prod.name, value: prod.refCode })));

      setFilteredProducts(products);
      return setProductsBase(products);
    }
    try {
      const products = await ProductActions.getAll();
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
      const prod = await ProductActions.create(product);

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
      const nextProduct = await ProductActions.update(product);
      const newProducts = productsBase.map(p => (p.refCode === nextProduct.refCode ? nextProduct : { ...p }));

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
  async function handleDeleteProduct(index) {
    const obj = productsFiltered.find(prod => prod.id === index);
    if (DEBUG_LOCAL) {
      const nextProducts = productsBase.filter(cat => cat.id !== obj.id);

      setFilteredProducts(nextProducts);
      setProductsBase(nextProducts);
      return updateData(ENTITIES.PRODUCTS, nextProducts);
    }

    try {
      await ProductActions.delete(obj.id);
      const updatedProducts = productsBase.filter(cat => cat.id !== obj.id);
      setFilteredProducts(updatedProducts);
      setProductsBase(updatedProducts);
    } catch (e) {
      handleOpenSnackBar("error", e.message, 3500);
    }
  }

  function handleFilter(value) {
    setFilter(value);
    setLoading(true);
    setFilteredProducts(productsBase, value);
  }

  function getExpiryDatesByProduct(refCode) {
    const thisProductBatches = productsBase.filter(batch => batch.refCode === refCode)
      .map(batch => batch.expiry)
      .filter(expiry => expiry !== null);

    const expiryDates = new SuperArray(thisProductBatches).removeEquals();

    return expiryDates;
  }

  return (
    <ProductContext.Provider
      value={{
        productsBase,
        productsFiltered, filter, handleFilter,
        createProduct, updateProduct,
        errorInsert, handleDeleteProduct,
        productsWithoutSupply, getProductTotalQuantity,
        getExpiryDatesByProduct,
        loading
      }}
    >
      <Product />
    </ProductContext.Provider>
  )
}
