import React, { useState } from "react";
import useProduct from "../../hooks/useProduct"
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateProductDialog from "./dialogs/CreateProductDialog";
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import EditProductDialog from "./dialogs/EditProductDialog";

export default function Product() {

  const { products, createProduct, errorInsert,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar,
    updateProduct, handleDeleteProduct
  } = useProduct();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [idEditProduct, setIdEditProduct] = useState(null);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
    setIdMenu(null);
  }

  return (
    <>
      <Container>
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
          >
            Adicionar Produto
          </Button>
        </HeaderContainer>
        <TableContainer>
          <TableRow style={{background: '#DCDCDC', borderRadius: '8px 8px 0px 0px'}}>
            {/* <TableData width={"32%"} minWidth={'200px'}>{"Nome"}</TableData> */}
            <TableData style={{flex: 1}}>{"Descrição"}</TableData>
            <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{"ncmSh"}</TableData>
            <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{"Preço"}</TableData>
            <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{"Categoria"}</TableData>
            {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Supplier"}</TableData> */}
            <TableData style={{justifyContent: 'center', width: 40}}/>
          </TableRow>
          <div className="customScroll">
            {products.map((prod, index) => (
              <TableRow key={index} style={{
                borderRadius: index === products.length - 1 ? '0px 0px 8px 8px' : '0px',
                borderBottom: index === products.length - 1 ? '0px' : '1px solid #d3D3D3',
                background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
              }}>
                {/* <TableData width={"32%"} minWidth={'200px'}>{prod.name}</TableData> */}
                <TableData style={{flex: 1}}>
                  <ToolTipAndEllipsis item={prod.description} />
                </TableData>
                <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{prod.ncmSh}</TableData>
                <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{prod.price}</TableData>
                <TableData style={{justifyContent: 'center', width: 150, maxWidth: 150}}>{prod.category_id}</TableData>
                {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.supplier_id}</TableData> */}
                <TableData style={{justifyContent: 'center', width: 40}}>
                  <IconButton onClick={() => handleMenuOptions(index)}>
                    <MoreVertIcon fontSize='small'/>
                    {menuOption && idMenu === index && (
                      <ClickAwayListener onClickAway={handleCloseMenu}>
                        <Menu>
                          <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Produto"}</MenuOption>
                          <MenuOption onClick={() => {
                            setOpenEditProduct(true);
                            setIdEditProduct(index);
                            }}>{"Editar Produto"}</MenuOption>
                          <MenuOption onClick={() => setDeleteProduct(true)} style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} >{"Apagar Produto"}</MenuOption>
                        </Menu>
                      </ClickAwayListener>
                    
                  )}
                  </IconButton>
                  </TableData>
              </TableRow> 
            ))}
          </div>
        </TableContainer>
      </Container>

      {openCreateProduct && <CreateProductDialog 
        handleCreate={(prod) => {
          createProduct(prod);
          setOpenCreateProduct(false);
        }}
        handleClose={() => setOpenCreateProduct(false)}
        error={errorInsert}
        open={openCreateProduct}
      />}

      {openEditProduct && <EditProductDialog 
        handleEdit={(prod) => {
          updateProduct(prod);
          setOpenEditProduct(false);
        }}
        handleClose={() => setOpenEditProduct(false)}
        error={errorInsert}
        open={openEditProduct}
        product={products[idEditProduct]}
    
      />}

      {deleteProduct && (
        <Dialog
          open={deleteProduct}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{"Deseja  mesmo apagar essa categoria?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteProduct(false)}>Cancelar</Button>
            <Button onClick={() => {
              handleDeleteProduct({ product_id: products.find((p, i) => i === idMenu).id });
              setDeleteProduct(false);
            }}>Confirmar</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {openSnackBar && (
        <CustomizedSnackbars 
          open={openSnackBar}
          autoHide={autoHideSnackBar}
          handleClose={handleCloseSnackBar}
          severity={severitySnackBar}
          snackMessage={snackMessageSnackBar}
        />
      )}
    </>
  )
}

