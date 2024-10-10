import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React, { useContext } from 'react'
import { ProductContext } from '../ProductPage';

export default function DeleteProductDialog(props) {

  const { closeDialog, index } = props;
  const { handleDeleteProduct } = useContext(ProductContext);

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{"Deseja  mesmo apagar essa categoria?"}</DialogTitle>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button onClick={() => {
          handleDeleteProduct(index);
          closeDialog();
        }}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}
