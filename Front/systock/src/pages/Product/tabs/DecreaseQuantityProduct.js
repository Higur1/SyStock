import { Add, Remove } from '@mui/icons-material';
import { Autocomplete, Button, Divider, IconButton, Popper, Skeleton, TextField } from '@mui/material';
import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { ProductContext } from '../ProductPage';
import { formatDate } from '../../../utils/utils';
import useValidateForm, { FORM_TYPE } from '../../../hooks/useValidateForm';
import { MainContext } from '../../../App';
import ProductActions from '../../../Service/Product/ProductActions';
import BatchActions from '../../../Service/Batch/BatchActions';
import { SuperArray } from '../../../utils/arrayFunctions';

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

const LOADING_TYPE = {
  PRODUCTS: "products",
  DECREASING: "decreasing"
}

export default function DecreaseQuantityProduct() {

  const { handleOpenSnackBar } = useContext(MainContext);

  const batchsRef = useRef([]);
  const productsRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const extraHelpersValidate = useMemo(() => ({ currentQuantity }), [currentQuantity]);
  const [expiryList, setExpiryList] = useState([]);
  const [loading, setLoading] = useState([LOADING_TYPE.PRODUCTS]);

  const [values, setValues] = useState({ quantityToRemove: 0, expiryDate: null, reason: "" });
  const { error, hasError, hasInteracted, hasAnyError, resetValidate } = useValidateForm(values, FORM_TYPE.DECREASE_PRODUCT, extraHelpersValidate);

  useEffect(() => {
    getInitialInfos();
  }, []);

  async function getInitialInfos() {
    try {
      const batchs = await BatchActions.getAll();
      const products = await ProductActions.getAll();

      productsRef.current = products;
      batchsRef.current = batchs;
      handleLoading(LOADING_TYPE.PRODUCTS, false);
    } catch (e) {
      handleOpenSnackBar("error", e);
    }
  }

  function handleQuantity(type) {
    const nextValue = type === TYPES.MINUS ? values.quantityToRemove - 1 : values.quantityToRemove + 1;
    onChange("quantityToRemove", nextValue);
  }

  function handleLoading(type, value) {
    setLoading(prevLoading => value ? [...prevLoading, type] : prevLoading.filter(load => load !== type));
  }

  function onChange(type, value) {
    setValues(prev => ({ ...prev, [type]: value }));
  }

  async function onConfirm() {
    handleLoading(LOADING_TYPE.DECREASING, true);

    const product_id = 0;
    const expirationDate = values.expiryDate;
    const quantity = values.quantityToRemove;

    const obj = { product_id, expirationDate, quantity };
    try {
      await BatchActions.decreaseQuantity(obj);
      reset();
      handleOpenSnackBar("success", "Quantidade removida!", 3000);
    } catch (error) {
      handleOpenSnackBar("error", error);
    } finally {
      handleLoading(LOADING_TYPE.DECREASING, false);
    }
  }

  function handleChangeInput(e) {
    onChange("quantityToRemove", e.target.value);
  }

  function handleChangeProduct(value) {
    setProduct(value);
    setCurrentQuantity(getProductTotalQuantity(value.refCode));
    onChange("expiryDate", null);

    updateExpiryListByProduct(value.refCode);
  }

  function updateExpiryListByProduct(productID) {
    try {
      onChange("expiryDate", null);
      const expiryList = batchsRef.current
        .filter(batch => batch.productID === productID)
        .map(batch => batch.expiry)
        .filter(expiry => expiry !== null);

      const expiryListFiltered = new SuperArray(expiryList).removeEquals();

      setExpiryList(expiryListFiltered);

    } catch (error) {
      console.error(error);
      setExpiryList(null);
    }
  }

  function getProductTotalQuantity(productID) {
    try {
      const batchs = batchsRef.current.filter(batch => batch.productID === productID)
        .map(batch => batch.quantity);

      const totalQuantity = batchs.reduce((acc, batch) => acc + batch, 0);

      return totalQuantity;
    } catch (e) {
      console.error(e);
    }
  }

  function getQuantityByExpiryDate(expiryDate = new Date().toString()) {
    try {
      const date = new Date(expiryDate);

      const batch = batchsRef.current.find(batch => batch.expiry?.getTime() === date.getTime());

      if (batch) return setCurrentQuantity(batch.quantity);
    } catch (e) {
      console.error(e);
    }
  }

  function reset() {
    setProduct(null);
    setCurrentQuantity(0);
    setExpiryList(null);
    setValues({ quantityToRemove: 0, expiryDate: null, reason: "" });
    resetValidate();
  }

  const disabled = useMemo(() => loading.includes(LOADING_TYPE.DECREASING), [loading]);
  const disableConfirm = useMemo(() => hasAnyError || disabled, [hasAnyError, disabled]);

  const loadingProducts = loading.includes(LOADING_TYPE.PRODUCTS);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Autocomplete
          disablePortal
          options={productsRef.current}
          value={product}
          onChange={(event, newInputValue) => {
            handleChangeProduct(newInputValue);
          }}
          disabled={loadingProducts || productsRef.current === null}
          getOptionLabel={(option) => option.name}
          sx={{ flex: 1 }}
          renderInput={(params) => <TextField {...params} label="Produto" />}
          placeholder='Selecione o produto a ser abastecido'
          ListboxProps={{ style: { zIndex: 100 } }}
          PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
        />
        <span>Quantidade Atual: {loadingProducts ? <Skeleton variant="text" width={30} style={{ display: 'inline-block' }} /> : <strong>{currentQuantity}</strong>}</span>
      </div>
      <Divider />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>{"Quantidade a ser removida:"}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: (hasError("quantityToRemove") && hasInteracted("quantityToRemove")) ? "1px solid red" : "1px solid #DCDCDC" }}>
            <IconButton onClick={() => handleQuantity(TYPES.MINUS)} disabled={values.quantityToRemove === 0}>
              <Remove />
            </IconButton>
            <InputStyled
              error={hasError("quantityToRemove") && hasInteracted("quantityToRemove")}
              helperText={error["quantityToRemove"]}
              type="number"
              onChange={handleChangeInput}
              value={values.quantityToRemove}
              style={{ color: product && values.quantityToRemove === product.quantity ? "#4a7b9d" : "black" }}
            />
            <IconButton onClick={() => handleQuantity(TYPES.PLUS)}>
              <Add />
            </IconButton>
          </div>
        </div>
        <Autocomplete
          disablePortal
          options={expiryList}
          value={values.expiryDate}
          onChange={(event, newInputValue) => {
            onChange("expiryDate", newInputValue);
            getQuantityByExpiryDate(newInputValue);
          }}
          getOptionLabel={(option) => formatDate(option, false)}
          sx={{ flex: 1 }}
          renderInput={(params) => <TextField {...params} label="Data de Validade" />}
          placeholder='Selecione uma data de validate deste produto'
          ListboxProps={{ style: { zIndex: 100 } }}
          PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
        />
        <TextField
          id="outlined-multiline-static"
          label="Motivo"
          multiline
          value={values.reason}
          onChange={e => onChange("reason", e.target.value)}
          rows={4}
          variant="outlined"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant={"contained"} onClick={onConfirm} disabled={disableConfirm}>Confirmar</Button>
      </div>
    </div>
  )
}
