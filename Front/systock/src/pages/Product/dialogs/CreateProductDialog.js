import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import { DEBUG_LOCAL, MainContext } from "../../../App";
import { ENTITIES } from "../../../utils/debug-local-helper";
import CategoryActions from "../../../Service/Category/CategoryActions";
import Product from "../../../classes/Product";
import { ProductContext } from "../ProductPage";
import useValidateForm, { FORM_TYPE } from "../../../hooks/useValidateForm";
import ProductActions from "../../../Service/Product/ProductActions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding-top: 16px;
`;
export default function CreateProductDialog({onChangeTab}) {
  const { categories } = useContext(ProductContext);

  const [values, setValues] = useState({name: "", description: "", priceSell: 0, priceBuy: 0, categoryID: "", minimumQuantity: 0});
  const [loading, setLoading] = useState(false);

  const { error, hasError, hasInteracted, hasAnyError, resetValidate } = useValidateForm(values, FORM_TYPE.PRODUCT);


  const { handleOpenSnackBar } = useContext(MainContext);

  function onChange(type, value) {
    setValues(prev => ({...prev, [type]: value}))
  }

  async function onConfirm() {
    setLoading(true);
    const product = new Product();

    const category = categories.find(cat => cat.id === values.categoryID);

    product.category = category;
    product.description = values.description;
    product.minimumQuantity = values.minimumQuantity;
    product.name = values.name;
    product.priceBaseBuy = values.priceBuy;
    product.priceBaseSell = values.priceSell;

    try {
      await ProductActions.create(product);
      reset();
      handleOpenSnackBar("success", "Produto criado!!", 3000);
    } catch (error) {
      handleOpenSnackBar("error", error);
    } finally {
      setLoading(false);
    }
  }

  // function create() {
  //   const prod = new Product({});

  //   prod.name = name;
  //   prod.priceBaseSell = priceSell;
  //   prod.priceBaseBuy = priceBuy;
  //   prod.minimumQuantity = minimumQuantity;
  //   prod.description = description;
  //   prod.category = categoryID ? categories.find(cat => cat.id === categoryID) : null;
    
  //   handleCreate(prod);
  //   reset();
  // }

  function reset() {
    setValues({name: "", description: "", priceSell: 0, priceBuy: 0, categoryID: "", minimumQuantity: 0});
    resetValidate();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: "100%", height: "100%" }}>
      <Container>
        <TextField
          required
          label="Nome do Produto"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={hasError("name") && hasInteracted("name")}
          helperText={error["name"]}
          disabled={loading}
        />
        <TextField
          label="Preço de Venda"
          value={values.priceSell}
          onChange={(e) => onChange("priceSell", e.target.value)}
          placeholder={"ex: 100.00"}
          name="numberformat"
          id="formatted-numberformat-input-sell"
          error={hasError("priceSell") && hasInteracted("priceSell")}
          disabled={loading}
          helperText={error["priceSell"]}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>
          }}
        />
        <TextField
          label="Preço de Compra"
          value={values.priceBuy}
          onChange={(e) => onChange("priceBuy", e.target.value)}
          placeholder={"ex: 100.00"}
          name="numberformat"
          id="formatted-numberformat-input-buy"
          error={hasError("priceBuy") && hasInteracted("priceBuy")}
          disabled={loading}
          helperText={error["priceBuy"]}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>
          }}
        />
        <TextField
          label="Quantidade Mínima"
          value={values.minimumQuantity}
          onChange={(e) => onChange("minimumQuantity", e.target.value)}
          disabled={loading}
          helperText={error["minimumQuantity"]}
          error={hasError("minimumQuantity") && hasInteracted("minimumQuantity")}
          type="number"
        />
        <TextField
          label="Descrição"
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          disabled={loading}
        />
        <FormControl>
          <InputLabel id="test-select-label">Categoria do Produto</InputLabel>
          <Select
            value={values.categoryID}
            onChange={(e) => onChange("categoryID", e.target.value)}
            label="Categoria"
            disabled={loading}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((cat, index) => (
              <MenuItem value={cat.id} key={index}>{cat.name}</MenuItem>
            )
            )}
          </Select>
        </FormControl>
      </Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant={"contained"} disabled={loading || hasAnyError} onClick={onConfirm}>Adicionar</Button>
      </div>
    </div>
  );
}

CreateProductDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  handleCreate: PropTypes.func,
  error: PropTypes.object
};