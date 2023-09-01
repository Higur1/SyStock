import React, { useState } from "react";
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import useSupplier from "../../hooks/useSupplier";
import CreateSupplierDialog from "./dialogs/CreateSupplierDialog";
import EditSupplierDialog from "./dialogs/EditSupplierDialog";
import { LocationOn, Visibility } from "@mui/icons-material";

export default function Supplier() {

  const { 
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier, updateSupplier, handleDeleteSupplier,
    errorMessage
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
            <TableData style={{flex: 1, minWidth: '10%', maxWidth: 'calc(100% - (75% + 40px + 96px))'}}>{"Nome"}</TableData>
            <TableData style={{flexBasis: '25%', maxWidth: '25%', minWidth: '25%'}}>{"E-mail"}</TableData>
            <TableData style={{flexBasis: '20%', maxWidth: '20%', minWidth: '20%'}}>{"Telefone"}</TableData>
            <TableData style={{flexBasis: '25%', maxWidth: '25%', minWidth: '25%'}}>{"Endereço"}</TableData>
            <TableData style={{flexBasis: '5%', maxWidth: '5%', minWidth: '5%'}}>{"Lotes"}</TableData>
            <TableData style={{flex: 1, justifyContent: 'flex-end'}} />
          </TableRow>
          {Boolean(suppliers.length) && suppliers.map((sup, index) => (
            <TableRow key={index} style={{
              borderRadius: index === suppliers.length - 1 ? '0px 0px 8px 8px' : '0px',
              borderBottom: index === suppliers.length - 1 ? '0px' : '1px solid #d3D3D3',
              background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
            }}>
              <TableData style={{flex: 1, minWidth: '10%', maxWidth: 'calc(100% - (75% + 40px + 96px))'}}><ToolTipAndEllipsis item={sup.name} /></TableData>
              <TableData style={{flexBasis: '25%', maxWidth: '25%', minWidth: '25%'}}><ToolTipAndEllipsis item={sup.email} /></TableData>
              <TableData style={{flexBasis: '20%', maxWidth: '20%', minWidth: '20%'}}>TELEFONE</TableData>
              <TableData style={{flexBasis: '25%', maxWidth: '25%', minWidth: '25%', cursor: 'pointer'}} onClick={() => alert('info endereço')}>
                <LocationOn />
                <ToolTipAndEllipsis item={sup.Address[0].state} />
              </TableData>
              <TableData style={{flexBasis: '5%', maxWidth: '5%', minWidth: '5%'}}>
                {76}
                <IconButton onClick={() => alert('dialog lotes')}>
                  <Visibility />
                </IconButton>
                
              </TableData>
              <TableData style={{flex: 1, justifyContent: 'flex-end'}}>
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
          setOpenCreateSupplier(false);
          createSupplier(sup);
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

