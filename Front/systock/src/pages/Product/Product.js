import React, { useState } from "react";
import useProduct from "../../hooks/useProduct"
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Box, Button, Chip, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateProductDialog from "./dialogs/CreateProductDialog";
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import EditProductDialog from "./dialogs/EditProductDialog";
import CircularLoading from "../../components/common/CircularLoading";
import ChangeQuantityProductDialog from "./dialogs/ChangeQuantityProductDialog";

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

export default function Product() {

  const { productsBase, productsFiltered, createProduct, errorInsert,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar,
    updateProduct, handleDeleteProduct, filter, handleFilter
  } = useProduct();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [idEditProduct, setIdEditProduct] = useState(null);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);
  const [openQuantity, setOpenQuantity] = useState({open: false, index: -1});

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
    setIdMenu(null);
  }

  function handleQuantityDialog(index) {
    setOpenQuantity({open: true, index});
  }

  return (
    <>
      <Container>
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
            onClick={() => setOpenCreateProduct(true)}
            size="small"
          >
            Adicionar Produto
          </Button>
        </HeaderContainer>
        <div style={{gridArea: "table", height: "100%", overflow: 'hidden'}}>
          {productsBase === null || productsFiltered === null ? (
            <CircularLoading />
          ) : (
            <TableContainer>
              <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
                {/* <TableData width={"32%"} minWidth={'200px'}>{"Nome"}</TableData> */}
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{"Código de Referência"}</TableData>
                <TableData style={{ flex: 1 }}>{"Nome"}</TableData>
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{"Categoria"}</TableData>
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{"Preço"}</TableData>
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{"Quantidade"}</TableData>
                {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Supplier"}</TableData> */}
                <TableData style={{ justifyContent: 'center', width: 40 }} />
              </TableRow>
              <div className="customScroll">
                {(productsFiltered.length > 0) && productsFiltered.map((prod, index) => (
                  <TableRow key={index} style={{
                    borderRadius: index === productsFiltered.length - 1 ? '0px 0px 8px 8px' : '0px',
                    borderBottom: index === productsFiltered.length - 1 ? '0px' : '1px solid #d3D3D3',
                    background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                  }}>
                    {/* <TableData width={"32%"} minWidth={'200px'}>{prod.name}</TableData> */}
                    <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.refCode}</TableData>
                    <TableData style={{ flex: 1 }}>{prod.name}</TableData>
                    <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.category}</TableData>
                    <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.price}</TableData>
                    <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.quantity}</TableData>
                    {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.supplier_id}</TableData> */}
                    <TableData style={{ justifyContent: 'center', width: 40 }}>
                      <IconButton onClick={() => handleMenuOptions(index)}>
                        <MoreVertIcon fontSize='small' />
                        {menuOption && idMenu === index && (
                          <ClickAwayListener onClickAway={handleCloseMenu}>
                            <Menu>
                              <MenuOption style={{ borderRadius: '16px 16px 0px 0px' }}>{"Visualizar Produto"}</MenuOption>
                              <MenuOption onClick={() => {
                                setOpenEditProduct(true);
                                setIdEditProduct(index);
                              }}>{"Editar Produto"}</MenuOption>
                              <MenuOption onClick={() => handleQuantityDialog(index)}>{"Alterar Quantidade"}</MenuOption>
                              <MenuOption onClick={() => setDeleteProduct(true)} style={{ borderBottom: '0px', borderRadius: '0px 0px 16px 16px' }} >{"Apagar Produto"}</MenuOption>
                            </Menu>
                          </ClickAwayListener>

                        )}
                      </IconButton>
                    </TableData>
                  </TableRow>
                ))}
              </div>
            </TableContainer>
          )
          }
        </div>

      </Container >

      {openCreateProduct && <CreateProductDialog
        handleCreate={(prod) => {
          createProduct(prod);
          setOpenCreateProduct(false);
        }}
        handleClose={() => setOpenCreateProduct(false)}
        error={errorInsert}
        open={openCreateProduct}
      />}

      {
        openEditProduct && <EditProductDialog
          handleEdit={(prod) => {
            updateProduct(prod);
            setOpenEditProduct(false);
          }}
          handleClose={() => setOpenEditProduct(false)}
          error={errorInsert}
          open={openEditProduct}
          product={productsFiltered[idEditProduct]}

        />
      }

      {
        deleteProduct && (
          <Dialog
            open={deleteProduct}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>{"Deseja  mesmo apagar essa categoria?"}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setDeleteProduct(false)}>Cancelar</Button>
              <Button onClick={() => {
                handleDeleteProduct({ product_id: productsFiltered.find((p, i) => i === idMenu).id });
                setDeleteProduct(false);
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
        openQuantity.open && (
          <ChangeQuantityProductDialog onConfirm={updateProduct} onClose={() => setOpenQuantity({open: false, index: -1})} product={productsFiltered[openQuantity.index]} />
        )
      }
    </>
  )
}

