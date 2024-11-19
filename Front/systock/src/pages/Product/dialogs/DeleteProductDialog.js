import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React, { useContext } from 'react'
import { ProductContext } from '../ProductPage';
import ProductActions from '../../../Service/Product/ProductActions';
import { MainContext } from '../../../App';

export default function DeleteProductDialog(props) {

  const { closeDialog, product } = props;
  const { handleDeleteProduct } = useContext(ProductContext);
  const { handleOpenSnackBar } = useContext(MainContext);
  
  async function onDelete() {
    const { id } = product;

    try {
      await ProductActions.delete(id);
      
      handleOpenSnackBar("success", "Produto apagado com sucesso!", 3500);
      handleDeleteProduct(id);
      closeDialog();
    } catch (e) {
      handleOpenSnackBar("error", e, 3500);
    }
  }

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{"Deseja  mesmo apagar esse produto?"}</DialogTitle>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button onClick={onDelete}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}
