import React, { useEffect, useState } from "react";
import { Container, HeaderContainer, TableContainer, TableData, TableRow } from "./styles";
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import useSupplier from "../../hooks/useSupplier";
import CreateSupplierDialog from "./dialogs/CreateSupplierDialog";
import { LocationOn, Visibility } from "@mui/icons-material";
import ButtonGroupCustom from "../../components/common/ButtonGroupCustom/ButtonGroupCustom";
import LocationDialog from "./dialogs/LocationDialog";
import BatchListDialog from "./dialogs/BatchListDialog";

export default function Supplier() {

  const { 
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier, updateSupplier, handleDeleteSupplier,
    handleChangeSelectedPhone
  } = useSupplier();

  const [menuOption, setMenuOption] = useState({
    open: false,
    index: null,
    anchor: null
  });
  const [openCreateEditSupplier, setOpenCreateEditSupplier] = useState({
    open: false,
    sup: null
  });
  const [deleteSupplier, setDeleteSupplier] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState({open: false, index: null});
  const [openBatchDialog, setOpenBatchDialog] = useState({open: false, index: null});

  useEffect(() => {
    if(!openCreateEditSupplier.open || !deleteSupplier || !openLocationDialog.open) {
      handleCloseMenu();
    }

  }, [openCreateEditSupplier.open, deleteSupplier, openLocationDialog.open]);

  function handleBatchList(index) {
    setOpenBatchDialog({open: true, index});
  }

  function handleCloseBatchList() {
    setOpenBatchDialog({open: false, index: null});
  }

  function handleMenuOptions(e, index) {
    setMenuOption({
      anchor: e.currentTarget,
      open: true,
      index
    });
  }

  function handleCloseMenu() {
    setMenuOption({
      open: false,
      index: null,
      anchor: null
    });
  }

  function handleOpenCreateEditDialog() {
    setOpenCreateEditSupplier({
      open: true,
      sup: suppliers[menuOption.index]
    });
  }

  function handleCloseCreateEditDialog() {
    setOpenCreateEditSupplier({
      open: false,
      sup: null
    });
  }
  
  return (
    <>
      <Container>
        <HeaderContainer>
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={handleOpenCreateEditDialog}
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
              <TableData style={{flexBasis: '20%', maxWidth: '20%', minWidth: '20%', gap: 8}}>
                {
                  <>
                    <ButtonGroupCustom 
                      options={[
                        {id: 0, label: 1},
                        {id: 1, label: 2}
                      ]}
                      value={sup.Phone.findIndex(phone => phone.isSelected)}
                      onChange={(v) => handleChangeSelectedPhone(v, index)}
                    />
                    {sup.Phone.find(phone => phone.isSelected).phone}  
                  </>
                }
              </TableData>
              <TableData style={{flexBasis: '25%', maxWidth: '25%', minWidth: '25%', cursor: 'pointer'}} onClick={() => setOpenLocationDialog({open: true, index})}>
                <LocationOn />
                <ToolTipAndEllipsis item={`${sup.Address[0].street}, ${sup.Address[0].number}`} />
              </TableData>
              <TableData style={{flexBasis: '5%', maxWidth: '5%', minWidth: '5%'}}>
                {76}
                <IconButton onClick={() => handleBatchList(index)}>
                  <Visibility />
                </IconButton>
                
              </TableData>
              <TableData style={{flex: 1, justifyContent: 'flex-end'}}>
                <IconButton onClick={(e) => handleMenuOptions(e, index)}>
                  <MoreVertIcon fontSize='small'/>
                </IconButton>
              </TableData>
            </TableRow> 
          ))}
        </TableContainer>
      </Container>

      
      {menuOption.open && (
        <Menu
          anchorEl={menuOption.anchor}
          open
          onClose={handleCloseMenu}
        >
          <MenuItem style={{borderRadius: '16px 16px 0px 0px'}} onClick={handleOpenCreateEditDialog}>{"Editar Fornecedor"}</MenuItem>
          <MenuItem onClick={() => setDeleteSupplier(true)} style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} >{"Apagar Fornecedor"}</MenuItem>
        </Menu>
      )}

      {openCreateEditSupplier.open && <CreateSupplierDialog 
        handleCreate={(sup) => {
          if(openCreateEditSupplier.sup) {
            updateSupplier(sup);
            handleCloseCreateEditDialog();
          } else {
            createSupplier(sup);
            handleCloseCreateEditDialog();
          }
        }}
        handleClose={() => {
          handleCloseCreateEditDialog();
        }}
        open
        
        supplierObj={openCreateEditSupplier.sup}
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
              handleDeleteSupplier({ id: suppliers[menuOption.index].id });
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

      {openLocationDialog.open && (
        <LocationDialog
          address={suppliers[openLocationDialog.index].Address[0]}
          handleClose={() => setOpenLocationDialog({open: false, index: null})}
        />
      )}

      {openBatchDialog.open && (
        <BatchListDialog
          handleClose={handleCloseBatchList}
          id={suppliers[openBatchDialog.index].id}
        />
      )}
    </>
  )
}

