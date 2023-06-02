import React, { useState } from "react";
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Button, ClickAwayListener, IconButton } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import useSupplier from "../../hooks/useSupplier";
import CreateSupplierDialog from "./dialogs/CreateSupplierDialog";

export default function Supplier() {

  const { 
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier
  } = useSupplier();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [idEditProduct, setIdEditProduct] = useState(null);
  const [openCreateSupplier, setOpenCreateSupplier] = useState(false);
  // const [openEditProduct, setOpenEditProduct] = useState(false);
  // const [deleteProduct, setDeleteProduct] = useState(false);

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
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setOpenCreateSupplier(true)}
          >
            Adicionar Fornecedor
          </Button>
        </HeaderContainer>
        <TableContainer>
          <TableRow style={{background: '#DCDCDC', borderRadius: '8px 8px 0px 0px'}}>
            {/* <TableData width={"32%"} minWidth={'200px'}>{"Nome"}</TableData> */}
            <TableData width={"35%"} minWidth={'300px'}>{"Nome"}</TableData>
            <TableData width={"35%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"E-mail"}</TableData>
            <TableData width={"12%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Telefone"}</TableData>
            <TableData width={"40px"} style={{justifyContent: 'center'}} minWidth={'40px'} />
          </TableRow>
          {suppliers.map((sup, index) => (
            <TableRow key={index} style={{
              borderRadius: index === suppliers.length - 1 ? '0px 0px 8px 8px' : '0px',
              borderBottom: index === suppliers.length - 1 ? '0px' : '1px solid #d3D3D3',
              background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
            }}>
              <TableData width={"35%"} minWidth={'300px'}>
                <ToolTipAndEllipsis item={sup.name} />
              </TableData>
              <TableData width={"35%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{sup.email}</TableData>
              <TableData width={"12%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{sup.phone}</TableData>
              {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{sup.supplier_id}</TableData> */}
              <TableData width={"40px"} style={{justifyContent: 'center'}}minWidth={'40px'}>
                <IconButton onClick={() => handleMenuOptions(index)}>
                  <MoreVertIcon fontSize='small'/>
                  {menuOption && idMenu === index && (
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                      <Menu>
                        <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Produto"}</MenuOption>
                        <MenuOption>{"Editar Produto"}</MenuOption>
                        <MenuOption style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} >{"Apagar Produto"}</MenuOption>
                      </Menu>
                    </ClickAwayListener>
                  
                )}
                </IconButton>
              </TableData>
            </TableRow> 
          ))}
        </TableContainer>
      </Container>

      {openCreateSupplier && <CreateSupplierDialog 
        handleCreate={(sup) => {
          createSupplier(sup);
          setOpenCreateSupplier(false);
        }}
        handleClose={() => setOpenCreateSupplier(false)}
        open={openCreateSupplier}
      />}
{/* 
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
        handleEdit={updateProduct}
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
        </Dialog> */}
      {/* )} */}
      
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

