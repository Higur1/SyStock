import { Autocomplete, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Popper, Select, Slide, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import { MainContext } from "../../../App";
import ProductActions from "../../../Service/Product/ProductActions";
import { ProductContext } from "../ProductPage";
import { NumericFormatCustom } from "../../../components/common/InputCurrency";
import Product from "../../../classes/Product";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding-top: 16px;
`

export default function EditProductDialog(props) {
  const { handleClose, open, product = new Product() } = props;

  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [priceBuy, setPriceBuy] = useState(product.priceBaseBuy || 0);
  const [priceSell, setPriceSell] = useState(product.priceBaseSell || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(product.category || null);
  const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  const { handleOpenSnackBar } = useContext(MainContext);
  const { updateProduct, categories } = useContext(ProductContext);


  const handlePriceBuyChange = e => {
    let value = e.target.value;
    
    if(!currencyRegex.test(value)) {
      // setHasErrorPrice(true);
    }
    setPriceBuy(e.target.value);
  }

  const handlePriceSellChange = e => {
    let value = e.target.value;
    
    if(!currencyRegex.test(value)) {
      // setHasErrorPrice(true);
    }
    setPriceSell(e.target.value);
  }
  
  async function onEdit(prod) {
    handleOpenSnackBar("info", "Editando produto...", undefined);
    try {
      const nextProduct = await ProductActions.update(prod);
      handleOpenSnackBar("success", "Produto editado com sucesso!", 3500);
      updateProduct(nextProduct);
      handleClose();
    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Editar Produto"}</Title></DialogTitle>
        <DialogContent>
          <Container>
            <TextField
              required
              label="Código de referência"
              value={product.refCode}
              disabled
            />
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0,255))}
              disabled={isLoading}
            />
            <TextField
              value={priceBuy}
              label="Preço de Compra"
              style={{ flex: 1 }}
              name={"priceBuy"}
              disabled={isLoading}
              onChange={handlePriceBuyChange}
              Input
              InputProps={{
                inputComponent: NumericFormatCustom,
              }}
            />
            <TextField
              value={priceSell}
              label="Preço de Venda"
              style={{ flex: 1 }}
              name={"priceSell"}
              disabled={isLoading}
              onChange={handlePriceSellChange}
              Input
              InputProps={{
                inputComponent: NumericFormatCustom,
              }}
            />
            <Autocomplete
              disablePortal
              value={category}
              onChange={(event, newInputValue) => {
                console.log(newInputValue)
                setCategory(newInputValue);
              }}
              options={categories}
              getOptionLabel={(option) => option.name}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Categoria" />}
              PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
              // PopperComponent={<Popper style={{zIndex: 2}}/>}
              ListboxProps={{ style: { zIndex: 5 } }}
            />
            <TextField
              label="Observação"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0,255))}
              disabled={isLoading}
            />
          </Container>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button disabled={
              name === '' || 
              !currencyRegex.test(priceBuy) || 
              !currencyRegex.test(priceSell) || isLoading
            } onClick={() => {
            setIsLoading(true);
            const strpriceSell = parseFloat(priceSell);
            const strpriceBuy = parseFloat(priceBuy);

            const nextProduct = {
              ...product,
              name,
              description,
              priceBuy: strpriceBuy,
              priceBaseBuy: strpriceBuy,
              priceSell: strpriceSell,
              priceBaseSell: strpriceSell,
              category
            };

            onEdit(nextProduct);
            }}>Confirmar</Button>
        </DialogActions>

      </Dialog>
    </>
  );
}

EditProductDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  handleEdit: PropTypes.func,
  error: PropTypes.object,
  product: PropTypes.object
};