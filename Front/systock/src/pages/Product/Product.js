import React, { useState } from "react";
import useProduct from "../../hooks/useProduct"
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Box, Button, Chip, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Tab, Tabs } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateProductDialog from "./dialogs/CreateProductDialog";
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import EditProductDialog from "./dialogs/EditProductDialog";
import CircularLoading from "../../components/common/CircularLoading";
import AddSupply from "./dialogs/AddSupply";
import { formatDate } from "../../utils/utils";

export const FILTER_TYPES = {
  ALL: "ALL",
  NEXT_TO_EXPIRY: "NEXT_TO_EXPIRY",
  LOW_QUANTITY: "LOW_QUANTITY",
  EMPTY: "EMPTY",
  EXPIRED: "EXPIRED"
};

export const TABS = {
  PRODUCTS_LIST: "PRODUCTS_LIST",
  CREATE_PRODUCT: "CREATE_PRODUCT",
  CHANGE_QUANTITY: "CHANGE_QUANTITY",
  VIEW_SUPPLIES: "VIEW_SUPPLIES",
}

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

const TYPES_DIALOG = {
  NONE: 0,
  ADD_PRODUCT: 1,
  ADD_SUPPLY: 2,
  EDIT_PRODUCT: 3,
  DELETE_PRODUCT: 4,
  VIEW_SUPPLIES: 5
}

const tabsList = [
  {type: TABS.PRODUCTS_LIST, label: "Lista de Produtos"},
  {type: TABS.CREATE_PRODUCT, label: "Criar Produto"},
  {type: TABS.CHANGE_QUANTITY, label: "Alterar Quantidade"},
  {type: TABS.VIEW_SUPPLIES, label: "Visualizar Abastecimentos"},
];

export default function Product() {

  const { productsBase, productsFiltered, createProduct, errorInsert,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar,
    updateProduct, handleDeleteProduct, filter, handleFilter
  } = useProduct();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [dialog, setDialog] = useState({ type: TYPES_DIALOG.NONE});
  const [tab, setTab] = useState(TABS.PRODUCTS_LIST);

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
    setIdMenu(null);
  }

  function handleQuantityDialog(index) {
    setDialog({ type: TYPES_DIALOG.ADD_PRODUCT, index});
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Container>
        <div style={{display: 'flex', flexDirection: 'column', width: "100%", gridArea: "tab"}}>
          <Tabs onChange={handleChange} value={tab}>
            {tabsList.map((tab, i) => (<Tab label={tab.label} value={tab.type} key={i} />))}
          </Tabs>
          <Divider />
        </div>
        
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
        <HeaderContainer>
          {/* <Autocomplete
            multiple
            id="combo-box-category"
            options={categories.map(cat => cat.label)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            value={selectedCategories}
            onChange={(event, newValue) => handleSelectedOptions(newValue)}
            sx={{ width: '100%', margin: 0 }}
            renderInput={(params) => <TextField {...params} label="Categoria" />}
          /> */}
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setDialog({type: TYPES_DIALOG.ADD_PRODUCT})}
            size="small"
          >
            Adicionar Produto
          </Button>
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setDialog({type: TYPES_DIALOG.ADD_SUPPLY})}
            size="small"
          >
            Adicionar Abastecimento
          </Button>
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setDialog({type: TYPES_DIALOG.VIEW_SUPPLIES})}
            size="small"
          >
            Visualizar Abastecimentos
          </Button>
        </HeaderContainer>

        
        <div style={{ gridArea: "table", height: "100%", overflow: 'hidden' }}>
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

                      if(column.value === "menu") {
                        return (
                          <TableData style={{ justifyContent: 'center', width: 40 }} key={`row-${index}-${i}`}>
                            <IconButton onClick={() => handleMenuOptions(index)}>
                              <MoreVertIcon fontSize='small' />
                              {menuOption && idMenu === index && (
                                <ClickAwayListener onClickAway={handleCloseMenu}>
                                  <Menu>
                                    <MenuOption style={{ borderRadius: '16px 16px 0px 0px' }}>{"Visualizar Produto"}</MenuOption>
                                    <MenuOption onClick={() => {
                                      setDialog({type: TYPES_DIALOG.EDIT_PRODUCT, id: index});
                                    }}>{"Editar Produto"}</MenuOption>
                                    <MenuOption onClick={() => setDialog({type: TYPES_DIALOG.DELETE_PRODUCT})} style={{ borderBottom: '0px', borderRadius: '0px 0px 16px 16px' }} >{"Apagar Produto"}</MenuOption>
                                  </Menu>
                                </ClickAwayListener>
                              )}
                            </IconButton>
                          </TableData>
                        )
                      }

                      if(column.value === "category") {
                        return (
                          <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value].name}</TableData>
                        );
                      }
                      if(column.value === "expiry") {
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

      </Container >

      {dialog.type === TYPES_DIALOG.ADD_PRODUCT && <CreateProductDialog
        handleCreate={(prod) => {
          createProduct(prod);
          setDialog({type: TYPES_DIALOG.NONE});
        }}
        handleClose={() => setDialog({type: TYPES_DIALOG.NONE})}
        error={errorInsert}
        open  
      />}

      {(dialog.type === TYPES_DIALOG.EDIT_PRODUCT) && <EditProductDialog
          handleEdit={(prod) => {
            updateProduct(prod);
            setDialog({type: TYPES_DIALOG.NONE});
          }}
          handleClose={() => setDialog({type: TYPES_DIALOG.NONE})}
          error={errorInsert}
          open
          product={productsFiltered[dialog.index]}

        />
      }

      {
        dialog.type === TYPES_DIALOG.DELETE_PRODUCT && (
          <Dialog
            open
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>{"Deseja  mesmo apagar essa categoria?"}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setDialog({type: TYPES_DIALOG.NONE})}>Cancelar</Button>
              <Button onClick={() => {
                handleDeleteProduct({ product_id: productsFiltered.find((p, i) => i === idMenu).id });
                setDialog({type: TYPES_DIALOG.NONE});
              }}>Confirmar</Button>
            </DialogActions>
          </Dialog>
        )
      }

      {
        openSnackBar && (
          <CustomizedSnackbars
            open={openSnackBar}
            autoHide={autoHideSnackBar}
            handleClose={handleCloseSnackBar}
            severity={severitySnackBar}
            snackMessage={snackMessageSnackBar}
          />
        )
      }

      {
        dialog.type === TYPES_DIALOG.ADD_SUPPLY && (
          <AddSupply onConfirm={() => {}} onClose={() => setDialog({type: TYPES_DIALOG.NONE})} />
        )
      }

      {
        dialog.type === TYPES_DIALOG.ADD_SUPPLY && (
          <AddSupply onConfirm={() => {}} onClose={() => setDialog({type: TYPES_DIALOG.NONE})} />
        )
      }
    </>
  )
}

  