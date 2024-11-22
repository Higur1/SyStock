import React, { useContext, useEffect, useState } from 'react'
import CircularLoading from '../../../components/common/CircularLoading';
import { ContainerProductsList, TableContainer, TableData, TableRow } from '../styles';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { ProductContext } from '../ProductPage';
import { centerContent, getSorting } from '../../../utils/utils';
import { ArrowDownward, ArrowUpward, MoreVert, Search } from '@mui/icons-material';
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
  { hasSort: true, fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120, },
  { hasSort: true, fixedWidth: false, width: 200, label: "Nome", value: "name" },
  { hasSort: true, fixedWidth: true, width: 200, label: "Categoria", value: "category" },
  { hasSort: false, fixedWidth: true, width: 150, label: "Preço de Venda", value: "priceBaseSell" },
  { hasSort: false, fixedWidth: true, width: 80, label: "Quantidade", value: "totalQuantity" },
  { hasSort: false, fixedWidth: true, width: 100, label: "", value: "menu" }
];

export default function ProductList({ openMenu }) {
  const { loading, listOfProducts } = useContext(ProductContext);

  const [productsFiltered, setProductsFiltered] = useState(null);
  const [filter, setFilter] = useState({ name: "", refCode: "" });
  const [sort, setSort] = useState({ type: "name", order: "asc" });

  useEffect(() => {
    if (listOfProducts === null) return;
    getFilteredProducts();
  }, [filter, listOfProducts, sort]);

  function onChange(type, value) {
    setFilter(prev => ({ ...prev, [type]: value }));
  }

  function getFilteredProducts() {
    const nextList = listOfProducts.filter(prod => {
      const condition1 = (filter.name === "") || (prod.name.trim().toLowerCase().indexOf(filter.name) !== -1);
      const condition2 = (filter.refCode === "") || filter.refCode.toString() === prod.id.toString();

      return condition1 && condition2;
    });

    setProductsFiltered(nextList.sort(getSorting(sort.type, sort.order)));
  }

  function handleSort(type) {

    setSort(prev => {
      if (type === prev.type) return ({ type, order: prev.order === "asc" ? "desc" : "asc" });

      return ({ type, order: 'asc' });
    });
  }

  return (
    <ContainerProductsList>
      <div style={{ display: 'flex', gap: 16 }}>
        <TextField onBlur={(e) => onChange("refCode", e.target.value)} label={"Buscar por Código"} style={{flexBasis: "33%"}}
          InputProps={{
            endAdornment: <InputAdornment position="end" style={{ cursor: 'pointer' }}><IconButton><Search /></IconButton></InputAdornment>
          }}
        />
        <TextField onBlur={(e) => onChange("name", e.target.value)} label={"Buscar por nome"} style={{flex: 1}}
          InputProps={{
            endAdornment: <InputAdornment position="end" style={{ cursor: 'pointer' }}><IconButton><Search /></IconButton></InputAdornment>
          }}
        />
      </div>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {loading ? (
          <CircularLoading />
        ) : (
          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => {
                if (column.hasSort) {
                  return (
                    <TableData style={{
                      textAlign: centerContent(column.value) ? "center" : "left",
                      justifyContent: centerContent(column.value) ? "center" : "flex-start",
                      width: column.fixedWidth ? column.width : "100%",
                      maxWidth: column.fixedWidth ? column.width : "auto",
                      flex: column.fixedWidth ? "none" : "1", cursor: 'pointer', gap: 8
                    }} onClick={() => handleSort(column.value)}
                      key={`header-column-${i}`}>
                      {column.label}
                      {column.value === sort.type && (
                        <>
                          {sort.order === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                        </>
                      )}
                    </TableData>
                  )
                }

                return (
                  <TableData style={{
                    textAlign: centerContent(column.value) ? "center" : "left",
                    justifyContent: centerContent(column.value) ? "center" : "flex-start",
                    width: column.fixedWidth ? column.width : "100%",
                    maxWidth: column.fixedWidth ? column.width : "auto",
                    flex: column.fixedWidth ? "none" : "1"
                  }}
                    key={`header-column-${i}`}>{column.label}</TableData>
                );
              })}
            </TableRow>
            <div className="customScroll">
              {Boolean(productsFiltered.length === 0) && (
                <NoData />
              )}
              {(productsFiltered.length > 0) && productsFiltered.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === productsFiltered.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === productsFiltered.length - 1 ? '0px' : '1px solid #d3D3D3',
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
                          flex: column.fixedWidth ? "none" : "1",
                          overflow: 'hidden'
                        }}
                      >
                        <TooltipAndEllipsis item={TableRenderUI(column.value, prod[column.value])} centerText={centerContent(column.value)} />
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