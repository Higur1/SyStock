import React, { useContext } from 'react'
import { SellListContainer, TableContainer, TableData, TableRow } from '../styles'
import { SellRegistersContext } from '../SellRegistersPage';
import { IconButton } from '@mui/material';
import { Description, Visibility } from '@mui/icons-material';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent } from '../../../utils/utils';

const columns = [
  { fixedWidth: true, label: "Data da Venda", value: "date", width: 120 },
  { fixedWidth: true, label: "Código da Venda", value: "codSell", width: 200 },
  { fixedWidth: true, label: "Produtos", value: "products", width: 150 },
  { fixedWidth: true, label: "Total", value: "total", width: 150 },
  { fixedWidth: true, label: "Forma de Pagamento", value: "paymentType", width: 200 },
  { fixedWidth: true, label: "Observação", value: "obs", width: 100 },
];

export default function SellList() {
  const { sellList } = useContext(SellRegistersContext);

  return (
    <SellListContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: "1.5rem" }}>
        {"Lista de vendas realizadas"}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>

      </div>
      <div>
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
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
              {sellList.map((log, index) => (
                <TableRow key={index}>
                  {columns.map((column, i) => {

                    if (column.value === "obs") {
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
                          <IconButton onClick={() => { }}>
                            <Description />
                          </IconButton>
                        </TableData>
                      )
                    }

                    if (column.value === "products") {
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
                          <IconButton onClick={() => { }}>
                            <Visibility />
                          </IconButton>
                        </TableData>
                      )
                    }

                    return (
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
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </TableContainer>
        </div>
      </div>
    </SellListContainer>
  )
}
