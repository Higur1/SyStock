import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import { DEBUG_LOCAL, MainContext } from "../../../App";
import { ENTITIES} from "../../../utils/debug-local-helper";
import CategoryActions from "../../../Service/Category/CategoryActions";

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
  const { handleEdit, handleClose, error, open, product } = props;

  const { id } = product;
  const [name, setName] = useState("");
  const [description, setDescription] = useState(product.description || "");
  const [priceBuy, setPriceBuy] = useState(product.priceBuy || 0);
  const [priceSell, setPriceSell] = useState(product.priceSell || 0);
  const [categories, setCategories] = useState([])
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(product.category || null);
  const isMount = useRef();
  const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  const { getData } = useContext(MainContext);

  useEffect(() => {
    if(isMount.current) return;
    
    isMount.current = true;
    getCategories();
  }, []);

  async function getCategories() {
    if(DEBUG_LOCAL) {
      const categArr = getData(ENTITIES.CATEGORIES);

      return setTimeout(() => setCategories(categArr), 350);
    }
    try {
      const categories = await CategoryActions.getAll();
      setCategories(categories);
    } catch (error) {
      console.log(error.message);
    }
  }

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
              label="NCM/SH"
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
              label="Preço de Compra"
              value={priceBuy}
              onChange={handlePriceBuyChange}
              placeholder={"ex: 100.00"}
              name="numberformat"
              id="formatted-numberformat-input"
              disabled={isLoading}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <TextField
              label="Preço de Venda"
              value={priceSell}
              onChange={handlePriceSellChange}
              placeholder={"ex: 100.00"}
              name="numberformat"
              id="formatted-numberformat-input"
              disabled={isLoading}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <FormControl>
              <InputLabel id="test-select-label">Categoria do Produto</InputLabel>
              <Select
                value={category}
                onChange={(e, target) => setCategory(target)}
                labelId="test-select-label"
                label="Categoria"
                disabled={isLoading}
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
          <Button onClick={() => {
            if(product.ncmSh === '' || description === '' ||
              priceBuy === 0 || priceSell === 0 || categories === null) {
              setHasError(true);
              return;
            }

            if(!currencyRegex.test(priceBuy)) {
              // setHasErrorPrice(true);
              return;
            }

            if(!currencyRegex.test(priceSell)) {
              // setHasErrorPrice(true);
              return;
            }

            setIsLoading(true);
            const strpriceSell = parseFloat(priceSell);
            const strpriceBuy = parseFloat(priceBuy);
            const product = {
              ...product,
              id,
              description,
              priceBuy: strpriceBuy,
              priceSell: strpriceSell,
              // supplier_id: supplierID
            };

            handleEdit(product);
            }}>Editar</Button>
        </DialogActions>

      </Dialog>

      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
      >
      <CircularProgress color="inherit" />
      </Backdrop>
    
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