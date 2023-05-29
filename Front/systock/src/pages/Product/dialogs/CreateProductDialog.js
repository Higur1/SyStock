import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import { performFetch } from "../../../apiBase";

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

const CurrencyInputCustom = () => {
  return (
    <CurrencyInput
    />
  );
};

export default function CreateProductDialog(props) {
  const { handleCreate, handleClose, error, open } = props;


  const [name, setName] = useState("");
  const [ncmsh, setNcmsh] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryID, setCategoryID] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [categories, setCategories] = useState([])
  const [hasError, setHasError] = useState(false);
  const [hasErrorPrice, setHasErrorPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMount = useRef();
  const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  useEffect(() => {
    if(isMount.current) return;
    
    isMount.current = true;
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const categories = await performFetch("/categories", {method: 'GET'});
      setCategories(categories);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handlePriceChange = e => {
    let value = e.target.value;
    
    if(!currencyRegex.test(value)) {
      setHasErrorPrice(true);
    }
    setPrice(e.target.value);
  }
  
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Adicionar Produto"}</Title></DialogTitle>
        <DialogContent>
          <Container>
          <TextField
              required
              label="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0,50))}
              error={hasError}
              disabled={isLoading}
            />
            <TextField
              required
              label="NCM/SH"
              value={ncmsh}
              onChange={(e) => setNcmsh(e.target.value.slice(0,8))}
              error={hasError}
              disabled={isLoading}
            />
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0,255))}
              error={hasError}
              disabled={isLoading}
            />
            <TextField
              label="Preço"
              value={price}
              onChange={handlePriceChange}
              placeholder={"ex: 100.00"}
              name="numberformat"
              id="formatted-numberformat-input"
              disabled={isLoading}
              error={hasErrorPrice}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
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
            <div style={{color: 'red', display:'flex', flexDirection: 'column'}}>
              {hasErrorPrice && <>{"Vírgulas não são necessárias, apenas pontos."}</>}
              {hasError && <>{"Preencha os campos obrigatórios!"}</>}
              {error !== null && <>{error.message}</>}
            </div>
          </Container>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => {
            if(name === '' || ncmsh === '' || description === '' ||
              price === 0 || categoryID === '' || supplierID === '') {
              setHasError(true);
              return;
            }

            if(!currencyRegex.test(price)) {
              setHasErrorPrice(true);
              return;
            }

            setIsLoading(true);

            const product = {
              name,
              ncmsh,
              description,
              price,
              category_id: categoryID,
              supplier_id: supplierID
            };

            handleCreate(product);
            }}>Adicionar</Button>
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

CreateProductDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  handleCreate: PropTypes.func,
  error: PropTypes.object
};