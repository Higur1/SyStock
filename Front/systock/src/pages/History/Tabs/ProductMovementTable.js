import React, { useContext } from 'react'
import { TableContainer, TableData, TableRow } from '../styles'
import { HistoryContext } from '../HistoryPage';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent } from '../../../utils/utils';

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
              textAlign: centerContent(column.value) ? "center" : "left", 
              justifyContent: centerContent(column.value) ? "center" : "flex-start", 
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
                  textAlign: centerContent(column.value) ? "center" : "left", 
                  justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                  width: column.width,
                  maxWidth: column.fixedWidth ? column.width : "auto",
                  flex: column.fixedWidth ? "none" : "1",
                  overflow: 'hidden'
                }}
              >
                <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, log[column.value])} />
              </TableData>
            ))}
          </TableRow>
        ))}
      </div>
    </TableContainer>
  )
}
