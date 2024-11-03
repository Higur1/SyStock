import React, { createContext, useState } from 'react'
import SellRegisters from '.';
import SellRegistersActions from '../../Service/SellRegisters/SellRegistersActions';
import { dateToTextField } from '../../utils/utils';

export const SellRegistersContext = createContext();

export const loadingTypes = {
  SELL_LIST: "SELL_LIST",
  CLOSING_LIST: "CLOSING_LIST"
};

export default function SellRegistersPage() {

  const [sellList, setSellList] = useState([]);
  const [loading, setLoading] = useState([]);

  
  const [dateFiltered, setDateFiltered] = useState(dateToTextField());
  const [closingList, setClosingList] = useState([]);

  async function getSellsList() {
    setLoading(prevList => [...prevList, loadingTypes.SELL_LIST]);

    try {
      const result = await SellRegistersActions.getAllProductMovement();
      setSellList(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.SELL_LIST));
    }
  }

  async function getClosingLists() {
    setLoading(prevList => [...prevList, loadingTypes.CLOSING_LIST]);

    try {
      const result = await SellRegistersActions.getAllClosingList();
      setClosingList(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.CLOSING_LIST));
    }
  }

  async function confirmEditSell(sell) {

  }

  


  return (
    <SellRegistersContext.Provider value={{ sellList, loading, getSellsList, confirmEditSell, closingList, dateFiltered, getClosingLists, setDateFiltered }}>
      <SellRegisters />
    </SellRegistersContext.Provider>
  )
}
