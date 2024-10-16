import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import { DEBUG_LOCAL, MainContext } from "../../../App";
import { ENTITIES } from "../../../utils/debug-local-helper";
import CategoryActions from "../../../Service/Category/CategoryActions";
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
`;
export default function CreateProductDialog(props) {
  const { handleCreate, handleClose, error, open } = props;


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceSell, setPriceSell] = useState(0);
  const [priceBuy, setPriceBuy] = useState(0);
  const [categoryID, setCategoryID] = useState("");
  const [categories, setCategories] = useState([])
  const [hasError, setHasError] = useState(false);
  const [hasErrorPrice, setHasErrorPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [minimumQuantity, setMinimumQuantity] = useState(false);
  const isMount = useRef();
  const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  const { getData } = useContext(MainContext);

  useEffect(() => {
    if (isMount.current) return;

    isMount.current = true;
    getCategories();
  }, []);

  async function getCategories() {
    if (DEBUG_LOCAL) {
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

  const handlePriceChangeSell = e => {
    let value = e.target.value;

    if (!currencyRegex.test(value)) {
      setHasErrorPrice(true);
    }
    setPriceSell(e.target.value);
  }

  const handlePriceChangeBuy = e => {
    let value = e.target.value;

    if (!currencyRegex.test(value)) {
      setHasErrorPrice(true);
    }
    setPriceBuy(e.target.value);
  }

  function create() {
    const prod = new Product({});

    prod.name = name;
    prod.priceBaseSell = priceSell;
    prod.priceBaseBuy = priceBuy;
    prod.minimumQuantity = minimumQuantity;
    prod.description = description;
    prod.category = categoryID ? categories.find(cat => cat.id === categoryID) : null;
    
    handleCreate(prod);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: "100%", height: "100%" }}>
      <Container>
        <TextField
          required
          label="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          disabled={isLoading}
        />
        <TextField
          label="Preço de Venda"
          value={priceSell}
          onChange={handlePriceChangeSell}
          placeholder={"ex: 100.00"}
          name="numberformat"
          id="formatted-numberformat-input"
          disabled={isLoading}
          error={hasErrorPrice}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>
          }}
        />
        <TextField
          label="Preço de Compra"
          value={priceBuy}
          onChange={handlePriceChangeBuy}
          placeholder={"ex: 100.00"}
          name="numberformat"
          id="formatted-numberformat-input"
          disabled={isLoading}
          error={hasErrorPrice}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>
          }}
        />
        <TextField
          label="Quantidade Mínima"
          value={minimumQuantity}
          onChange={(e) => setMinimumQuantity(e.target.value.slice(0, 255))}
          disabled={isLoading}
          type="number"
        />
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 255))}
          disabled={isLoading}
        />
        <FormControl>
          <InputLabel id="test-select-label">Categoria do Produto</InputLabel>
          <Select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
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
        {/* <FormControl>
              <InputLabel id="test-select-label">Supplier</InputLabel>
              <Select
                value={supplierID}
                onChange={(e) => setSupplierID(e.target.value)}
                labelId="test-select-label"
                label="Supplier"
                disabled={isLoading}
                defaultValue={1}
              >
                <MenuItem value='1'>
                  <em>None</em>
                </MenuItem>
                {suppliers.map((cat, index) => (
                  <MenuItem value={cat.id} key={index}>{cat.name}</MenuItem>
                )
                )}
              </Select>
            </FormControl> */}
        <div style={{ color: 'red', display: 'flex', flexDirection: 'column' }}>
          {hasErrorPrice && <>{"Vírgulas não são necessárias, apenas pontos."}</>}
          {hasError && <>{"Preencha os campos obrigatórios!"}</>}
          {error !== null && <>{error.message}</>}
        </div>
      </Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant={"contained"} onClick={handleClose}>Cancelar</Button>
        <Button variant={"contained"} onClick={() => {
          if (description === '' ||
            priceSell === 0 || priceBuy === 0 ||categoryID === '') {
            setHasError(true);
            return;
          }

          if (!currencyRegex.test(priceSell)) {
            setHasErrorPrice(true);
            return;
          }
          if (!currencyRegex.test(priceBuy)) {
            setHasErrorPrice(true);
            return;
          }

          setIsLoading(true);

          create();
        }}>Adicionar</Button>
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