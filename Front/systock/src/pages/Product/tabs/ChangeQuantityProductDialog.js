import { Add, Delete, Remove } from '@mui/icons-material';
import { Autocomplete, Button, IconButton, Popper, TextField } from '@mui/material';
import React, { useContext } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { ProductContext } from '../ProductPage';
import { formatDate } from '../../../utils/utils';

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

export default function ChangeQuantityProduct(props) {
  const { onClose } = props;
  const [product, setProduct] = useState(null);
  const [nextQuantity, setNextQuantity] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentExpiryDate, setCurrentExpiryDate] = useState(null);
  const [expiryList, setExpiryList] = useState(null);

  const { productsWithoutSupply, getProductTotalQuantity, getExpiryDatesByProduct } = useContext(ProductContext);

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
    setCurrentQuantity(getProductTotalQuantity(value.refCode));
    setExpiryList(getExpiryDatesByProduct(value.refCode));
    setCurrentExpiryDate(null);
  }
  console.log({ product });

  const disableConfirm = product === null || nextQuantity === 0;

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
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <span>Quantidade Atual: <strong>{currentQuantity}</strong></span>
        <div style={{ display: 'flex', gap: 16, paddingTop: 16, alignItems: 'center' }}>
          <span>{"Quantidade a ser removida:"}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: "1px solid #DCDCDC" }}>
            <IconButton onClick={() => handleQuantity(TYPES.MINUS)} disabled={nextQuantity === 0}>
              <Remove />
            </IconButton>
            <InputStyled type="number" onChange={handleChangeInput} value={nextQuantity} style={{ color: product && nextQuantity === product.quantity ? "#4a7b9d" : "black" }} />
            <IconButton onClick={() => handleQuantity(TYPES.PLUS)}>
              <Add />
            </IconButton>
          </div>
        </div>
        <Autocomplete
          disablePortal
          options={expiryList}
          value={currentExpiryDate}
          onChange={(event, newInputValue) => {
            handleChangeProduct(newInputValue);
          }}
          getOptionLabel={(option) => formatDate(option, false)}
          sx={{ flex: 1 }}
          renderInput={(params) => <TextField {...params} label="Data de Validade" />}
          placeholder='Selecione uma data de validate deste produto'
          ListboxProps={{ style: { zIndex: 100 } }}
          PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant={"contained"} onClick={onClose}>Cancelar</Button>
        <Button variant={"contained"} onClick={onConfirm} disabled={disableConfirm}>Confirmar</Button>
      </div>
    </div>
  )
}
