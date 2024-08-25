import React, { useContext, useState } from 'react'
import CircularLoading from '../../../components/common/CircularLoading';
import { ContainerProductsList, MenuOption, TableContainer, TableData, TableRow } from '../styles';
import { ClickAwayListener, Divider, FormControlLabel, IconButton, Menu, Radio, RadioGroup } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProductContext } from '../ProductPage';
import { formatDate } from '../../../utils/utils';


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


const columns = {
  [FILTER_TYPES.ALL]: [
    { label: "Código de Referência", value: "refCode" },
    { label: "Nome", value: "name" },
    { label: "Categoria", value: "category" },
    { label: "Preço de Venda", value: "priceBaseSell" },
    { label: "Quantidade", value: "totalQuantity" },
    { label: "", value: "menu" }
  ],
  [FILTER_TYPES.NEXT_TO_EXPIRY]: [
    { label: "Data de Vencimento", value: "expiry" },
    { label: "Código de Referência", value: "refCode" },
    { label: "Nome", value: "name" },
    { label: "Categoria", value: "category" },
    { label: "Quantidade Total", value: "totalQuantity" },
    { label: "Quantidade nessa Validade", value: "totalQuantitySameExpiry" },
    { label: "", value: "menu" }
  ],
  [FILTER_TYPES.LOW_QUANTITY]: [
    { label: "Código de Referência", value: "refCode" },
    { label: "Nome", value: "name" },
    { label: "Categoria", value: "category" },
    { label: "Quantidade Mínima Informada", value: "minimumQuantity" },
    { label: "Quantidade", value: "quantity" },
    { label: "", value: "menu" }
  ],
  [FILTER_TYPES.EMPTY]: [
    { label: "Código de Referência", value: "refCode" },
    { label: "Nome", value: "name" },
    { label: "Categoria", value: "category" },
    { label: "", value: "menu" }
  ],
  [FILTER_TYPES.EXPIRED]: [
    { label: "Data de Vencimento", value: "expiry" },
    { label: "Código de Referência", value: "refCode" },
    { label: "Nome", value: "name" },
    { label: "Categoria", value: "category" },
    { label: "Quantidade Total", value: "totalQuantity" },
    { label: "Quantidade Vencida", value: "totalQuantitySameExpiry" },
    { label: "", value: "menu" }
  ],
}

export default function ProductList(props) {

  const { handleEditProductDialog, handleDeleteProductDialog } = props;
  const { productsBase, productsFiltered, filter, handleFilter } = useContext(ProductContext);

  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
    setIdMenu(null);
  }

  return (
    <ContainerProductsList>
      <span style={{ fontWeight: 600 }}>Filtros</span>
      <RadioGroup row aria-label="position" name="position" value={filter} onChange={(_, value) => handleFilter(value)}>
        {filtersBase.map((filter, i) => (
          <FormControlLabel
            key={`filter-${i}`}
            value={filter.type}
            control={<Radio color="primary" />}
            label={filter.value}
            labelPlacement="bottom"
          />
        ))}
      </RadioGroup>

      <Divider />
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {productsBase === null || productsFiltered === null ? (
          <CircularLoading />
        ) : (
          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns[filter].map((column, i) => (
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }} key={`header-column-${i}`}>{column.label}</TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {(productsFiltered.length > 0) && productsFiltered.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === productsFiltered.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === productsFiltered.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                }}>
                  {columns[filter].map((column, i) => {

                    if (column.value === "menu") {
                      return (
                        <TableData style={{ justifyContent: 'center', width: 40 }} key={`row-${index}-${i}`}>
                          <IconButton onClick={() => handleMenuOptions(index)}>
                            <MoreVertIcon fontSize='small' />
                            {menuOption && idMenu === index && (
                              <ClickAwayListener onClickAway={handleCloseMenu}>
                                <Menu>
                                  <MenuOption style={{ borderRadius: '16px 16px 0px 0px' }}>{"Visualizar Produto"}</MenuOption>
                                  <MenuOption onClick={() => handleEditProductDialog(index)}>{"Editar Produto"}</MenuOption>
                                  <MenuOption onClick={() => handleDeleteProductDialog(index)} style={{ borderBottom: '0px', borderRadius: '0px 0px 16px 16px' }} >{"Apagar Produto"}</MenuOption>
                                </Menu>
                              </ClickAwayListener>
                            )}
                          </IconButton>
                        </TableData>
                      )
                    }

                    if (column.value === "category") {
                      return (
                        <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value].name}</TableData>
                      );
                    }
                    if (column.value === "expiry") {
                      return (
                        <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{formatDate(prod[column.value])}</TableData>
                      );
                    }

                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value]}</TableData>
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