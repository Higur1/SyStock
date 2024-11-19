import React, { useContext, useMemo, useState } from 'react'
import CircularLoading from '../../../components/common/CircularLoading';
import { ContainerProductsList, TableContainer, TableData, TableRow } from '../styles';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ProductContext } from '../ProductPage';
import { centerContent } from '../../../utils/utils';
import { MoreVert } from '@mui/icons-material';
import NoData from '../../../components/common/NoData';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';


export const FILTER_TYPES = {
  ALL: "ALL",
  NEXT_TO_EXPIRY: "NEXT_TO_EXPIRY",
  LOW_QUANTITY: "LOW_QUANTITY",
  EMPTY: "EMPTY",
  EXPIRED: "EXPIRED"
};

export const filtersBase = [
  { type: FILTER_TYPES.ALL, value: "Todos" },
  { type: FILTER_TYPES.NEXT_TO_EXPIRY, value: "Próximo do Vencimento" },
  { type: FILTER_TYPES.LOW_QUANTITY, value: "Baixa Quantidade" },
  { type: FILTER_TYPES.EMPTY, value: "Estoque Zerado" },
  { type: FILTER_TYPES.EXPIRED, value: "Vencidos" }
];

const columns = [
  { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120, },
  { fixedWidth: false, width: 200, label: "Nome", value: "name" },
  { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
  { fixedWidth: true, width: 150, label: "Preço de Venda", value: "priceBaseSell" },
  { fixedWidth: true, width: 80, label: "Quantidade", value: "totalQuantity" },
  { fixedWidth: true, width: 100, label: "", value: "menu" }
];

export default function ProductList({openMenu}) {
  const { loading, listOfProducts } = useContext(ProductContext);

  return (
    <ContainerProductsList>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {loading ? (
          <CircularLoading />
        ) : (
          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => (
                <TableData style={{ 
                  textAlign: centerContent(column.value) ? "center" : "left", 
                  justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                  width: column.fixedWidth ? column.width : "100%", 
                  maxWidth: column.fixedWidth ? column.width : "auto", 
                  flex: column.fixedWidth ? "none" : "1" 
                }} 
                key={`header-column-${i}`}>{column.label}</TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {Boolean(listOfProducts.length === 0) && (
                <NoData />
              )}
              {(listOfProducts.length > 0) && listOfProducts.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === listOfProducts.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === listOfProducts.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                }}>
                  {columns.map((column, i) => {

                    if (column.value === "menu") {
                      return (
                        <TableData style={{ justifyContent: 'center', gap: 8, width: column.width, maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1" }} key={`row-${index}-${i}`}>
                          <IconButton onClick={(e) => openMenu(e, prod)}>
                            <MoreVert />
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
                          width: column.fixedWidth ? column.width : "100%", 
                          maxWidth: column.fixedWidth ? column.width : "auto", 
                          flex: column.fixedWidth ? "none" : "1" ,
                          overflow:'hidden'
                        }}
                      >
                        <TooltipAndEllipsis item={TableRenderUI(column.value, prod[column.value])} centerText={centerContent(column.value)}/>
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </TableContainer>
        )
        }
      </div>
    </ContainerProductsList>
  )
}