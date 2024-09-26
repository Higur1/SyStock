import React, { createContext, useState } from 'react'
import SellRegisters from '.';

export const SellRegistersContext = createContext();

export default function SellRegistersPage() {

  const [sellList, setSellList] = useState([]); 

  return (
    <SellRegistersContext.Provider value={{ sellList }}>
      <SellRegisters />
    </SellRegistersContext.Provider>
  )
}
