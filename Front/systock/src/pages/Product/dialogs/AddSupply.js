import { Add, Delete, Remove } from '@mui/icons-material';
import { Autocomplete, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, Popper, TextField } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import SectionCollapser from '../../../components/common/SectionCollapser';
import { TableContainer, TableData, TableRow } from '../styles';
import Batch from '../../../classes/Batch';
import { MainContext } from '../../../App';
import { ENTITIES } from '../../../utils/debug-local-helper';
import Supply from '../../../classes/Supply';

const TYPES = {
  MINUS: "MINUS",
  PLUS: "PLUS",
}

const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

const columns = [
  { label: "Data de Validade", value: "expiry" },
  { label: "Nome", value: "name" },
  { label: "Quantidade", value: "quantity" },
  { label: "Preço de Custo", value: "priceBuy" },
  { label: "SubTotal", value: "subTotal" }
]

const initialConfigProduct = { priceBuy: 0, priceSell: 0, expiry: null, quantity: 0 };
const noneItem = { value: -1, label: "Nenhum" };

function total(arr) {
  try {
    const nextArr = arr.map(prod => (prod.quantity * prod.priceBuy));

    const sum = nextArr.reduce((accumulator, currentValue) => {
      const total = accumulator + currentValue;
      return total;
    }, 0);

    return sum;
  } catch (e) {
    return 0;
  }
  
}

export default function AddSupply(props) {
  const { onClose } = props;
  const [extraProps, setExtraProps] = useState(initialConfigProduct);
  const [productsToAdd, setProductsToAdd] = useState([]);
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState("");
  const [productsBase, setProductsBase] = useState([]);
  const [suppliersBase, setSuppliersBase] = useState([]);

  const { getData, updateData, handleOpenSnackBar } = useContext(MainContext);

  useEffect(() => {
    const suppliers = getData("suppliers");
    const products = getData("products");

    const nextSuppliers = suppliers.map((sup) => ({ label: sup.name, value: sup.email }));
    const nextProducts = products.map((prod) => ({ label: prod.name, value: prod.refCode }));

    setSuppliersBase(suppliers);
    setProductsBase(products);
    setSuppliers([noneItem, ...nextSuppliers]);
    setProducts([noneItem, ...nextProducts]);

    setProduct(noneItem);
    setSupplier(noneItem);
  }, []);

  function handleQuantity(type) {
    const nextValue = type === TYPES.MINUS ? extraProps.quantity - 1 : extraProps.quantity + 1;
    handleChangeExtraProps("quantity", nextValue);
  }

  function handleChangeExtraProps(type, value) {

    if (["priceSell", "priceBuy"].includes(type)) {
      if (!currencyRegex.test(value)) return;
    }
    setExtraProps(extraProps => ({ ...extraProps, [type]: value }));
  }
  

  function handleAddProduct() {
    const { value } = product;

    const nextProduct = productsBase.find(prod => prod.refCode === value);
    const productToAdd = new Batch({product: nextProduct, ...extraProps, supplier: null});


    setProductsToAdd(prevList => [...prevList, productToAdd]);
    setExtraProps(initialConfigProduct);
    setProduct(null);
  }

  function handleChangeProduct(result) {
    console.log(result);
    setProduct(result);

    const product = productsBase.find(prod => prod.refCode === result.value);
    if(!product) return;
    setExtraProps(prevExtra => ({...prevExtra, priceBuy: product.priceBaseBuy, priceSell: product.priceBaseSell}));
  }

  function handleCreateSupply() {
    const nextSupplier = supplier ? suppliersBase.find(sup => sup.email === supplier.value) : null;

    const batches = productsToAdd.map(prod => {
      const supplier = nextSupplier ? nextSupplier : null;

      prod.setSupplier(supplier);

      return prod;
    });

    const currentSupplies = getData(ENTITIES.SUPPLY_LIST);

    updateData(ENTITIES.SUPPLY_LIST, [...currentSupplies, new Supply({batches, description, supplier: nextSupplier ? nextSupplier : null})]);
    handleOpenSnackBar("success", "Abastecimento Criado", 5000);
    onClose();
  }

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{`Adicionar Abastecimento`}</DialogTitle>
      <Divider />
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Autocomplete
            disablePortal
            options={suppliers}
            value={supplier}
            onChange={(event, newInputValue) => {
              setSupplier(newInputValue);
            }}
            getOptionLabel={(option) => option.label}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Fornecedor do Abastecimento" />}
            placeholder='Selecione o fornecedor para o abastecimento'
            PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
            // PopperComponent={<Popper style={{zIndex: 2}}/>}
            ListboxProps={{ style: { zIndex: 5 } }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Autocomplete
              disablePortal
              options={products}
              value={product}
              onChange={(event, newInputValue) => {
                handleChangeProduct(newInputValue);
              }}
              getOptionLabel={(option) => option.label}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} label="Produto" />}
              placeholder='Selecione o produto a ser abastecido'
              ListboxProps={{ style: { zIndex: 100 } }}
              PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
            />
          </div>

          <Divider />

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: "wrap" }}>
            <TextField
              label="Preço de Venda"
              value={extraProps.priceSell}
              onChange={e => handleChangeExtraProps("priceSell", e.target.value)}
              placeholder={"ex: 100.00"}
              style={{ flexBasis: "calc(50% - 16px)" }}
              name="numberformat"
              id="formatted-numberformat-input"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <TextField
              label="Preço de Compra"
              value={extraProps.priceBuy}
              onChange={e => handleChangeExtraProps("priceBuy", e.target.value)}
              placeholder={"ex: 100.00"}
              style={{ flexBasis: "calc(50% - 16px)" }}
              name="numberformat"
              id="formatted-numberformat-input"
              input
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>
              }}
            />
            <TextField
              label="Quantidade"
              value={extraProps.quantity}
              onChange={e => handleChangeExtraProps("quantity", e.target.value)}
              type="number"
              style={{ flexBasis: "calc(50% - 16px)" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => handleQuantity(TYPES.MINUS)} disabled={extraProps.quantity === 0}>
                      {extraProps.quantity === 1 ? <Delete /> : <Remove />}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => handleQuantity(TYPES.PLUS)}>
                      <Add />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              inputProps={{ className: "removeArrowsNumber" }}
            />
            <TextField
              label="Data de Validade"
              type="date"
              style={{ flexBasis: "calc(50% - 16px)" }}
              defaultValue={Date.now().toLocaleString()}
              InputLabelProps={{
                shrink: true,
              }}
              value={extraProps.expiry}
              onChange={e => handleChangeExtraProps("expiry", e.target.value)}
            />
          </div>
          <Button onClick={handleAddProduct} disabled={extraProps.quantity === 0 || product === null || (product && product.value === -1)} startIcon={<Add />} style={{ width: 150, alignSelf: 'center' }} variant='contained'>Adicionar</Button>
          <Divider />
          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => (
                <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }} key={`header-column-${i}`}>{column.label}</TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {(productsToAdd.length > 0) && productsToAdd.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === productsToAdd.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === productsToAdd.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                }}>
                  {columns.map((column, i) => {

                    if(column.value === "subTotal") {
                      return (
                        <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.getSubTotal()}</TableData>
                      );
                    }
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value]}</TableData>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow style={{ borderRadius: '8px 8px 0px 0px' }}>
                {columns.map((column, i) => (
                  <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }} key={`column-${i}`}>{}</TableData>
                ))}
              </TableRow>
            </div>
          </TableContainer>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <TextField
              label="Observação"
              InputLabelProps={{
                shrink: true,
              }}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <TextField 
              label={"Total"} 
              variant='standard' 
              disabled 
              value={productsToAdd.length > 0 ? `${total(productsToAdd)}` : "0" } 
              style={{width: 150}}
              InputProps={{startAdornment: <InputAdornment position="start">R$</InputAdornment>}}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleCreateSupply}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}
