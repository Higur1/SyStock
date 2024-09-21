import React, { useContext } from 'react'
import { TableContainer, TableData, TableRow } from '../styles'
import { HistoryContext } from '../HistoryPage';

const columns = [
  { fixedWidth: true, label: "Data e Hora", value: "date", width: 120 },
  { fixedWidth: true, label: "Código de Referência", value: "codRef", width: 200 },
  { fixedWidth: false, label: "Nome", value: "name", width: 250 },
  { fixedWidth: true, label: "Quantidade", value: "quantity", width: 150 },
  { fixedWidth: true, label: "Movimentação", value: "movementType", width: 200 },
  { fixedWidth: true, label: "Responsável", value: "responsible", width: 250 },
];

export default function ProductMovementTable() {

  const { productMovementList } = useContext(HistoryContext);
  return (
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
        {productMovementList.map((log, index) => (
          <TableRow key={index}>
            {columns.map((column, i) => (
              <TableData
                key={`row-${index}-${i}`}
                style={{
                  justifyContent: column.fixedWidth ? "center" : "left",
                  width: column.width,
                  maxWidth: column.fixedWidth ? column.width : "auto",
                  flex: column.fixedWidth ? "none" : "1"
                }}
              >
                {log[column.value]}
              </TableData>
            ))}
          </TableRow>
        ))}
      </div>
    </TableContainer>
  )
}
