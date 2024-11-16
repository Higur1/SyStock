import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useMemo } from 'react';
import TableRenderUI from '../../../utils/TableRenderUI';
import styled from 'styled-components';
import { FILTER_TYPES } from '../../Product/tabs/productList';
import NoData from '../../../components/common/NoData';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent } from '../../../utils/utils';


export const TableContainer = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  background: "#ebebeb",
  border: '1px solid #d3D3D3',
  height: "100%",
  width: "100%"
});

export const TableRow = styled("div")({
  width: '100%',
  display: 'flex',
  gap: 16,
  height: '48px',
  padding: '0px 8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #d3D3D3'
});

export const TableData = styled("div")(() => ({
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  fontWeight: 600
}));


const columnsBase = {
  [FILTER_TYPES.NEXT_TO_EXPIRY]: [
    { fixedWidth: true, width: 100, label: "Data de Vencimento", value: "expiry" },
    { fixedWidth: true, label: "Código", value: "refCode", width: 80 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 120, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 100, label: "Quantidade Total", value: "totalQuantity" },
    { fixedWidth: true, width: 120, label: "Quantidade nessa Validade", value: "totalQuantitySameExpiry" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.LOW_QUANTITY]: [
    { fixedWidth: true, label: "Código", value: "refCode", width: 80 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 120, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 100, label: "Quantidade Mínima", value: "minimumQuantity" },
    { fixedWidth: true, width: 100, label: "Quantidade", value: "totalQuantity" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.EMPTY]: [
    { fixedWidth: true, label: "Código", value: "refCode", width: 80 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.EXPIRED]: [
    { fixedWidth: true, width: 100, label: "Data de Vencimento", value: "expiry" },
    { fixedWidth: true, label: "Código", value: "refCode", width: 80 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 100, label: "Quantidade Total", value: "totalQuantity" },
    { fixedWidth: true, width: 100, label: "Quantidade Vencida", value: "totalQuantitySameExpiry" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
}


export default function ViewAdvicesDialog(props) {

  const { onClose, obj } = props;
  const { label, list, type: filter } = obj;

  const columns = useMemo(() => columnsBase[filter], [filter]);

  console.log(list);

  return (
    <Dialog
      open
      maxWidth="lg"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>{`Produtos - ${label}`}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: ' column', width: "100%", height: "100%", gap: 16 }}>

          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => (
                <TableData style={{ 
                  textAlign: centerContent(column.value) ? "center" : "left", 
                  justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                  width: column.fixedWidth ? column.width : "100%", maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1" }} key={`header-column-${i}`}>{column.label}</TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {Boolean(list.length === 0) && (
                <NoData />
              )}
              {(list.length > 0) && list.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === list.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === list.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                }}>
                  {columns.map((column, i) => {
                    return (
                      <TableData 
                        key={`row-${index}-${i}`} 
                        style={{ 
                          textAlign: centerContent(column.value) ? "center" : "left", 
                          justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                          width: column.fixedWidth ? column.width : "100%", 
                          maxWidth: column.fixedWidth ? column.width : "auto", 
                          flex: column.fixedWidth ? "none" : "1" ,
                          overflow: "hidden"
                        }}
                      >
                        <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, prod[column.value])} />
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </TableContainer>
        </div>

      </DialogContent>
    </Dialog>
  )
}
