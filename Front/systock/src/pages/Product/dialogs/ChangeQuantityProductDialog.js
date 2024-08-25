import { Add, Delete, Remove } from '@mui/icons-material';
import { Autocomplete, Button, IconButton, Popper, TextField } from '@mui/material';
import React, { useContext } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { ProductContext } from '../ProductPage';

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
  const { onClose } = props;
  const [product, setProduct] = useState(null);
  const [nextQuantity, setNextQuantity] = useState(0);

  const { productsWithoutSupply } = useContext(ProductContext);

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

  function handleChangeProduct(value) {
    setProduct(value);
  }
  console.log({product});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Autocomplete
        disablePortal
        options={productsWithoutSupply}
        value={product}
        onChange={(event, newInputValue) => {
          handleChangeProduct(newInputValue);
        }}
        getOptionLabel={(option) => option.name}
        sx={{ flex: 1 }}
        renderInput={(params) => <TextField {...params} label="Produto" />}
        placeholder='Selecione o produto a ser abastecido'
        ListboxProps={{ style: { zIndex: 100 } }}
        PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
      />
      <div>
        <span>Quantidade Atual: <strong>{product ? product.quantity : ""}</strong></span>
        <div style={{ display: 'flex', gap: 16, paddingTop: 16, alignItems: 'center' }}>
          <span>{"Quantidade:"}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: "1px solid #DCDCDC" }}>
            <IconButton onClick={() => handleQuantity(TYPES.MINUS)} disabled={nextQuantity === 0}>
              {nextQuantity === 1 ? <Delete /> : <Remove />}
            </IconButton>
            <InputStyled type="number" onChange={handleChangeInput} value={nextQuantity} style={{ color: product && nextQuantity === product.quantity ? "#4a7b9d" : "black" }} />
            <IconButton onClick={() => handleQuantity(TYPES.PLUS)}>
              <Add />
            </IconButton>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant={"contained"} onClick={onClose}>Cancelar</Button>
        <Button variant={"contained"} onClick={onConfirm}>Confirmar</Button>
      </div>
    </div>
  )
}
