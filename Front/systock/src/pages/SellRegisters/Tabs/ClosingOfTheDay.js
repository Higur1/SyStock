import { TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { TableContainer, TableData, TableRow } from '../styles';
import { SellRegistersContext } from '../SellRegistersPage';
import { dateToTextField } from '../../../utils/utils';
import TableRenderUI from '../../../utils/TableRenderUI';

const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  width: "100%",
  height: "100%",
});

const GridContainer = styled.div`
  width: 100%;
  height: 80%;
  display: grid;
  grid-template:
    "date ." 48px
    "table table" 1fr
    / 200px 1fr;
  flex: 1;
  gap: 16px;
`;

const columns = [
  { fixedWidth: false, label: "Código da venda", value: "sellCode", width: 150 },
  { fixedWidth: false, label: "Valor da venda", value: "price", width: 150 },
];

export default function ClosingOfTheDay() {

  const { closingList, dateFiltered, setDateFiltered} = useContext(SellRegistersContext);

  useEffect(() => {

  }, []);
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexBasis: 48, fontSize: "1.5rem" }}>
        {"Fechamento das vendas por dia"}
      </div>
      <GridContainer>
        <TextField
          label="Data"
          type="date"
          size='small'
          value={dateToTextField(dateFiltered)}
          style={{ gridArea: "date" }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setDateFiltered(e.target.value)}
        />
        <div style={{ gridArea: "table", position: 'relative' }}>
          <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <TableRow>
                {columns.map((column, i) => (
                  <TableData
                    key={`header-${i}`}
                    style={{
                      justifyContent: column.fixedWidth ? "center" : "left",
                      width: column.width,
                      maxWidth: column.fixedWidth ? column.width : "auto",
                      flex: column.fixedWidth ? "none" : "1"
                    }}
                  >
                    {column.label}
                  </TableData>
                ))}
              </TableRow>
              <div className="customScroll">
                {closingList.map((log, index) => (
                  <TableRow key={index}>
                    {columns.map((column, i) => {
                      return (
                        <TableData
                          key={`row-${index}-${i}`}
                          style={{
                            justifyContent: column.fixedWidth ? "center" : "left",
                            width: column.width,
                            maxWidth: column.fixedWidth ? column.width : "auto",
                            flex: column.fixedWidth ? "none" : "1"
                          }}
                        >
                          {TableRenderUI(column.value, log[column.value])}
                        </TableData>
                      );
                    })}
                  </TableRow>
                ))}
              </div>
            </TableContainer>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: 'absolute', right: 16, bottom: -48 }}>
            <span>Total:</span>
            <strong>{"R$280.00"}</strong>
          </div>
        </div>
      </GridContainer>
    </Container>
  )
}
