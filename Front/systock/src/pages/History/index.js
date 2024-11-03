import { Tab, Tabs } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { Container, TableContainer, TableData, TableRow } from './styles';
import ProductMovementTable from './Tabs/ProductMovementTable';
import SupplyTable from './Tabs/SupplyTable';
import SalesTable from './Tabs/SalesTable';
import { HistoryContext } from './HistoryPage';

const TABS = {
  PRODUCT_MOVEMENT: "PRODUCT_MOVEMENT",
  SUPPLY: "SUPPLY",
  SALES: "SALES",
}

const tabsList = [
  { type: TABS.PRODUCT_MOVEMENT, label: "Histórico - Movimentação de Produtos" },
  { type: TABS.SUPPLY, label: "Histórico - Abastecimentos" },
  { type: TABS.SALES, label: "Histórico - Vendas" }
];

export default function History() {

  const { productMovementList, supplyList, salesList, loading, getProductMovementList, getSalesList, getSupplyList  } = useContext(HistoryContext);

  const [tab, setTab] = useState(TABS.PRODUCT_MOVEMENT);

  useEffect(() => {
    if(tab === TABS.PRODUCT_MOVEMENT) getProductMovementList();
    if(tab === TABS.SALES) getSalesList();
    if(tab === TABS.SUPPLY) getSupplyList();
  }, [tab]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const title = tabsList.find(tabs => tabs.type === tab).label;

  return (
    <Container>
      <Tabs onChange={handleChange} value={tab} style={{borderBottom: '1px solid #dcdcdc'}}>
        {tabsList.map((tab, i) => (<Tab label={tab.label} value={tab.type} key={i} />))}
      </Tabs>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: "1.5rem"}}>
        {title}
      </div>
      <div>
        <div style={{display: 'flex', width: '100%', height: '100%', overflow: 'hidden'}}>
          {tab === TABS.PRODUCT_MOVEMENT && (
            <ProductMovementTable />
          )}
          {tab === TABS.SUPPLY && (
            <SupplyTable />
          )}
          {tab === TABS.SALES && (
            <SalesTable />
          )}
        </div>
      </div>
    </Container>
  )
}
