import React, { useState } from "react";
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import useSupplier from "../../hooks/useSupplier";
import CreateSupplierDialog from "./dialogs/CreateSupplierDialog";
import EditSupplierDialog from "./dialogs/EditSupplierDialog";

export default function Supplier() {

  const { 
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier, updateSupplier, handleDeleteSupplier
  } = useSupplier();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [openCreateSupplier, setOpenCreateSupplier] = useState(false);
  const [openEditSupplier, setOpenEditSupplier] = useState(false);
  const [deleteSupplier, setDeleteSupplier] = useState(false);

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
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
              <TableData width={"12%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{sup.Phones.length ? sup.Phones[0].phone : null}</TableData>
              {/* <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{sup.supplier_id}</TableData> */}
              <TableData width={"40px"} style={{justifyContent: 'center'}}minWidth={'40px'}>
                <IconButton onClick={() => handleMenuOptions(index)}>
                  <MoreVertIcon fontSize='small'/>
                  {menuOption && idMenu === index && (
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                      <Menu>
                        <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Fornecedor"}</MenuOption>
                        <MenuOption onClick={() => setOpenEditSupplier(true)}>{"Editar Fornecedor"}</MenuOption>
                        <MenuOption onClick={() => setDeleteSupplier(true)} style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} >{"Apagar Fornecedor"}</MenuOption>
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

      {openEditSupplier && <EditSupplierDialog 
        handleEdit={(sup) => {
          updateSupplier(sup);
          setOpenEditSupplier(false);
        }}
        handleClose={() => setOpenEditSupplier(false)}
        supplier={suppliers[idMenu]}
        open={openEditSupplier}
      />}

      {deleteSupplier && (
        <Dialog
          open={deleteSupplier}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{"Deseja  mesmo apagar esse Fornecedor?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteSupplier(false)}>Cancelar</Button>
            <Button onClick={() => {
              handleDeleteSupplier({ id: suppliers[idMenu].id });
              setDeleteSupplier(false);
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

