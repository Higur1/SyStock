import React, { useState } from 'react'
import { Container } from './styles'
import { Tab, Tabs } from '@mui/material'
import SellList from './Tabs/SellList';
import EditSell from './dialogs/EditSell';
import Sell from './Tabs/Sell';
import ClosingOfTheDay from './Tabs/ClosingOfTheDay';

const TABS = {
  SELL_LIST: "SELL_LIST",
  SELL: "SELL",
  CLOSING_OF_THE_DAY: "CLOSING_OF_THE_DAY",
};

const tabsList = [
  { type: TABS.SELL_LIST, label: "Lista de Vendas" },
  { type: TABS.SELL, label: "Venda" },
  { type: TABS.CLOSING_OF_THE_DAY, label: "Fechamento do Dia" },
];

export default function SellRegisters() {

  const [tab, setTab] = useState(TABS.SELL_LIST);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container>
      <Tabs onChange={handleChange} value={tab} style={{ borderBottom: '1px solid #dcdcdc' }}>
        {tabsList.map((tab, i) => (<Tab label={tab.label} value={tab.type} key={i} />))}
      </Tabs>
      {tab === TABS.SELL_LIST && (<SellList />)}
      {tab === TABS.SELL && (<Sell />)}
      {tab === TABS.CLOSING_OF_THE_DAY && (<ClosingOfTheDay />)}

      {/* <EditSell /> */}
    </Container>
  )
}
