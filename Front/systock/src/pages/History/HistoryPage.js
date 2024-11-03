import React, { createContext, useState } from 'react'
import History from '.';
import HistoryActions from '../../Service/History/HistoryActions';

export const HistoryContext = createContext();

export const loadingTypes = {
  PRODUCT_MOVEMENT: "PRODUCT_MOVEMENT",
  SUPPLY: "SUPPLY",
  SALES: "SALES"
}

export default function HistoryPage() {

  const [productMovementList, setProductMovementList] = useState([]);
  const [loading, setLoading] = useState([]);
  const [supplyList, setSupplyList] = useState([]);
  const [salesList, setSalesList] = useState([]);

  async function getProductMovementList() {
    setLoading(prevList => [...prevList, loadingTypes.PRODUCT_MOVEMENT]);

    try {
      const result = await HistoryActions.getAllProductMovement();
      setProductMovementList(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.PRODUCT_MOVEMENT));
    }
  }

  async function getSupplyList() {
    setLoading(prevList => [...prevList, loadingTypes.SUPPLY]);

    try {
      const result = await HistoryActions.getAllSupply();
      setSupplyList(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.SUPPLY));
    }
  }

  async function getSalesList() {
    setLoading(prevList => [...prevList, loadingTypes.SALES]);

    try {
      const result = await HistoryActions.getAllSales();
      setSalesList(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.SALES));
    }
  }


  return (
    <HistoryContext.Provider value={{ productMovementList, supplyList, salesList, loading, getProductMovementList, getSalesList, getSupplyList }}>
      <History />
    </HistoryContext.Provider>

  )
}
