import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React, { useContext } from 'react'
import { ProductContext } from '../ProductPage';

export default function DeleteProductDialog(props) {

  const { closeDialog, product } = props;
  const { handleDeleteProduct } = useContext(ProductContext);

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{"Deseja  mesmo apagar esse produto?"}</DialogTitle>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button onClick={() => {
          handleDeleteProduct(product);
          closeDialog();
        }}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}
