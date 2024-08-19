import { Add, Delete, Remove } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import styled from 'styled-components';

const TYPES = {
  MINUS: "MINUS",
  PLUS: "PLUS",
}

const InputStyled = styled("input")({
  "&::-webkit-outer-spin-button": {
    "-webkit-appearance": "none"
  },
  "&::-webkit-inner-spin-button": {
    "-webkit-appearance": "none"
  },
  width: 50, fontWeight: 600, border: 'none', fontSize: "1rem",
   textAlign: "center"
});

export default function ChangeQuantityProductDialog(props) {
  const { product, onClose } = props;
  const [nextQuantity, setNextQuantity] = useState(product.quantity);

  function handleQuantity(type) {
    const nextValue = type === TYPES.MINUS ? nextQuantity - 1 : nextQuantity + 1;
    setNextQuantity(nextValue);
  }

  function onConfirm() {
    const nextProduct = { ...product, quantity: parseInt(nextQuantity) };

    props.onConfirm(nextProduct);
  }

  function handleChangeInput(e) {
    setNextQuantity(e.target.value);
  }

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{`Alterar quantidade - ${product.name}`}</DialogTitle>
      <Divider/>
      <DialogContent>
        <span>Quantidade Atual: <strong>{product.quantity}</strong></span>
        <div style={{ display: 'flex', gap: 16, paddingTop: 16, alignItems: 'center' }}>
          <span>{"Quantidade:"}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: "1px solid #DCDCDC" }}>
            <IconButton onClick={() => handleQuantity(TYPES.MINUS)} disabled={nextQuantity === 0}>
              {nextQuantity === 1 ? <Delete /> : <Remove />}
            </IconButton>
            <InputStyled type="number" onChange={handleChangeInput} value={nextQuantity} style={{color: nextQuantity === product.quantity ? "#4a7b9d": "black"}}/>
            <IconButton onClick={() => handleQuantity(TYPES.PLUS)}>
              <Add />
            </IconButton>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}
