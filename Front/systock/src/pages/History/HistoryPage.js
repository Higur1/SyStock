import React, { createContext, useState } from 'react'
import History from '.';

export const HistoryContext = createContext();


export default function HistoryPage() {
  
  const [productMovementList, setProductMovementList] = useState([]);
  const [supplyList, setSupplyList] = useState([]);
  const [salesList, setSalesList] = useState([]);

  return (
    <HistoryContext.Provider value={{productMovementList, supplyList, salesList}}>
      <History />
    </HistoryContext.Provider>
      
  )
}
