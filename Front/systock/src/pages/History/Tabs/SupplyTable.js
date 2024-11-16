import React, { useContext } from 'react'
import { TableContainer, TableData, TableRow } from '../styles'
import { HistoryContext } from '../HistoryPage';
import { IconButton } from '@mui/material';
import { Description, Visibility } from '@mui/icons-material';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent } from '../../../utils/utils';

const columns = [
  { fixedWidth: true, label: "Data e Hora", value: "date", width: 120 },
  { fixedWidth: false, label: "Fornecedor", value: "supplier", width: 250 },
  { fixedWidth: true, label: "Produtos", value: "products", width: 100 },
  { fixedWidth: true, label: "Total", value: "total", width: 200 },
  { fixedWidth: true, label: "Observação", value: "obs", width: 150 },
  { fixedWidth: true, label: "Responsável", value: "responsible", width: 250 },
];

export default function SupplyTable() {

  const { supplyList } = useContext(HistoryContext);
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
        {supplyList.map((log, index) => (
          <TableRow key={index}>
            {columns.map((column, i) => {

              if(column.value === "obs") {
                return (
                  <TableData
                    key={`row-${index}-${i}`}
                    style={{
                      textAlign: centerContent(column.value) ? "center" : "left", 
                      justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                      width: column.width,
                      maxWidth: column.fixedWidth ? column.width : "auto",
                      flex: column.fixedWidth ? "none" : "1"
                    }}
                  >
                    <IconButton onClick={() => {}}>
                      <Description />
                    </IconButton>
                  </TableData>
                )
              }

              if(column.value === "products") {
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
                    <IconButton onClick={() => {}}>
                      <Visibility />
                    </IconButton>
                  </TableData>
                )
              }

              return (
                <TableData
                  key={`row-${index}-${i}`}
                  style={{
                    justifyContent: column.fixedWidth ? "center" : "left",
                    width: column.width,
                    maxWidth: column.fixedWidth ? column.width : "auto",
                    flex: column.fixedWidth ? "none" : "1",
                    overflow: 'hidden'
                  }}
                >
                  <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, log[column.value])} />
                </TableData>
              );
            })}
          </TableRow>
        ))}
      </div>
    </TableContainer>
  )
}
