import { Add, Check, Clear, Delete, MoreVert, Remove } from '@mui/icons-material';
import { Autocomplete, Button, Divider, IconButton, InputAdornment, Menu, MenuItem, Popper, TextField } from '@mui/material';
import React, { useContext, useEffect, useMemo } from 'react'
import { useState } from 'react';
import { TableContainer, TableData, TableRow } from '../styles';
import Batch from '../../../classes/Batch';
import { MainContext } from '../../../App';
import ProductActions from '../../../Service/Product/ProductActions';
import SupplierActions from '../../../Service/Supplier/SupplierActions';
import BatchActions from '../../../Service/Batch/BatchActions';
import TableRenderUI from '../../../utils/TableRenderUI';
import Supply from '../../../classes/Supply';
import SupplyActions from '../../../Service/Supply/SupplyActions';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent, formatDateToTextField, removeFromHash, textFieldDateToDateObject } from '../../../utils/utils';
import { NumericFormat } from 'react-number-format';
import { NumericFormatCustom } from '../../../components/common/InputCurrency';
import Product from '../../../classes/Product';

const TYPES = {
  MINUS: "MINUS",
  PLUS: "PLUS",
}

const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

const columns = [
  { label: "Data de Validade", value: "expiry", fixedWidth: true, width: 150, },
  { label: "Nome", value: "name", fixedWidth: false, width: 80, },
  { label: "Quantidade", value: "quantity", fixedWidth: true, width: 120, },
  { label: "Preço de Custo", value: "priceBuy", fixedWidth: true, width: 150, },
  { label: "SubTotal", value: "subTotal", fixedWidth: true, width: 100, },
  { label: "", value: "menu", fixedWidth: true, width: 80, }
]

const initialConfigProduct = { priceBuy: 0, priceSell: 0, expiry: "", quantity: 0 };
const noneItem = { value: 0, label: "Nenhum" };

function total(arr) {
  try {
    const nextArr = arr.map(prod => (prod.quantity * prod.priceBuy));

    const sum = nextArr.reduce((accumulator, currentValue) => {
      const total = accumulator + currentValue;
      return total;
    }, 0);

    return sum.toFixed(2);
  } catch (e) {
    return 0;
  }

}

export default function IncreaseQuantity() {
  const [extraProps, setExtraProps] = useState(initialConfigProduct);
  const [productsToAdd, setProductsToAdd] = useState([]);
  const [product, setProduct] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState("");
  const [productsBase, setProductsBase] = useState([]);
  const [error, setError] = useState([]); 
  const [menu, setMenu] = useState({ anchor: null, index: null });
  const [editing, setEditing] = useState({});

  const MenuActions = useMemo(() => ({
    open: (e, index) => setMenu({ anchor: e.currentTarget, index }),
    close: () => setMenu({ anchor: null, index: null })
  }), []);

  const { handleOpenSnackBar } = useContext(MainContext);

  useEffect(() => {
    getInitialInfos();
  }, []);

  async function getInitialInfos() {
    try {
      const suppliers = await SupplierActions.getAll();
      const products = await ProductActions.getAll();

      const nextSuppliers = suppliers.map((sup) => ({ label: sup.name, value: sup.id }));
      const nextProducts = products.map((prod) => ({ label: prod.name, value: prod.refCode }));

      setProductsBase(products);
      setSuppliers([noneItem, ...nextSuppliers]);
      setProducts([noneItem, ...nextProducts]);

      setProduct(noneItem);
      setSupplier(noneItem);
    } catch (error) {
      handleOpenSnackBar("error", error, 5000);
    }
  }
  function handleQuantity(type) {
    const nextValue = type === TYPES.MINUS ? extraProps.quantity - 1 : extraProps.quantity + 1;
    handleChangeExtraProps("quantity", nextValue);
  }

  function handleChangeExtraProps(type, value) {
    clearError(type);
    if (["priceSell", "priceBuy"].includes(type)) {
      if (!currencyRegex.test(value)) return;
    }
    setExtraProps(extraProps => ({ ...extraProps, [type]: value }));
  }

  function handleChangeRowProps(id, type, value) {
    if (["priceSell", "priceBuy"].includes(type)) {
      if (!currencyRegex.test(value)) return;
    }
    setEditing(prev => {
      const nextEditingId = {...prev[id], [type]: value};
      
      return {...prev, [id]: nextEditingId};
    });
  }

  function verifyError() {
    if(!product || product?.value === 0) return "product";
    if([NaN, 0].includes(parseInt(extraProps.quantity))) return "quantity"; 

    return false;
  }
  function handleAddProduct() {
    const error = verifyError();
    if(error) return setError(prev => [...prev, error]);

    const { value } = product;

    const nextProduct = productsBase.find(prod => prod.refCode === value);
    const productToAdd = new Batch({ 
      productID: nextProduct.id, 
      product: nextProduct, 
      quantity: parseInt(extraProps.quantity), 
      ...extraProps, 
      expiry: textFieldDateToDateObject(extraProps.expiry), 
      supplier: null 
    });

    setProductsToAdd(prevList => [...prevList, productToAdd]);
    setExtraProps(initialConfigProduct);
    setProduct(null);
  }

  function clearError(type) {
    setError(prevError => prevError.filter(error => error !== type));
  }

  function handleChangeProduct(result) {
    clearError("product");
    setProduct(result);

    const product = productsBase.find(prod => prod.refCode === result.value);
    if (!product) return;
    setExtraProps(prevExtra => ({ ...prevExtra, priceBuy: product.priceBaseBuy, priceSell: product.priceBaseSell }));
  }

  async function handleAddQuantity() {
    const obj = new Supply();
    obj.batches = productsToAdd;
    obj.description = description;
    obj.supplierID = supplier.value || null;

    try {
      await SupplyActions.create(obj);
      reset();
      handleOpenSnackBar("success", "Abastecimento Criado", 5000);
    } catch (error) {
      handleOpenSnackBar("error", error);
    }
  }

  function handleStartEditing(index) {
    MenuActions.close();
    const prod = productsToAdd[index];

    const id = prod.frontID;

    const extraPropsOfProduct = { 
      priceBuy: prod.priceBuy, 
      priceSell: prod.priceSell,
      quantity: prod.quantity,
      expiry: prod.expiry ? formatDateToTextField(prod.expiry) : ""
    };

    setEditing(prevEditing => ({...prevEditing, [id]: extraPropsOfProduct}));
  } 

  console.log(productsToAdd);
  function confirmEditRow(id) {
    const prodIndex = productsToAdd.findIndex(prd => prd.frontID === id);

    console.log(productsToAdd[prodIndex]);
    const extraPropsOfProduct = editing[id];
    const nextProductToAdd = new Batch({ 
      product: new Product({...productsToAdd[prodIndex]}),
      productID: productsToAdd[prodIndex].productID, 
      ...extraPropsOfProduct, 
      quantity: parseInt(extraPropsOfProduct.quantity), 
      expiry: textFieldDateToDateObject(extraPropsOfProduct.expiry), 
      supplier: null 
    });

    setProductsToAdd(prevProducts => prevProducts.map((prod, index) => index === prodIndex ? nextProductToAdd : prod));
    setEditing(prevEditing => removeFromHash(prevEditing, id));
  }

  function cancelEditRow(id) {
    setEditing(prevEditing => removeFromHash(prevEditing, id));
  }

  function handleDeleteProduct(index) {
    MenuActions.close();
    setProductsToAdd(prev => prev.filter((p,i) => i !== index));
  }

  function reset() {
    setProductsToAdd([]);
    setProduct(null);
    setSupplier(noneItem);
    setExtraProps(initialConfigProduct);
    setDescription("");
  }

  return (
    <div style={{ width: "100%", height: "100%", flexDirection: 'column', gap: 16, display: 'flex', paddingTop: 16 }}>
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
            error={error.includes("product")}
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
            name="priceSell"
            Input
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
          />
          <TextField
            value={extraProps.priceBuy}
            style={{ flexBasis: "calc(50% - 16px)" }}
            name={"priceBuy"}
            onChange={(e) => {
              handleChangeExtraProps("priceBuy", e.target.value);
            }}
            label="Preço de Compra"
            Input
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
          />
          <TextField
            label="Quantidade"
            value={extraProps.quantity}
            onChange={e => handleChangeExtraProps("quantity", e.target.value)}
            type="number"
            error={error.includes("quantity")}
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
            InputLabelProps={{
              shrink: true,
            }}
            value={extraProps.expiry}
            onChange={e => handleChangeExtraProps("expiry", e.target.value)}
          />
        </div>
        <Button onClick={handleAddProduct} disabled={parseInt(extraProps.quantity) === 0 || product === null || (product && product.value === 0) || error.length > 0} startIcon={<Add />} style={{ width: 150, alignSelf: 'center' }} variant='contained'>Adicionar</Button>
        <Divider />
        <TableContainer>
          <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
            {columns.map((column, i) => (
              <TableData
                style={{
                  textAlign: centerContent(column.value) ? "center" : "left",
                  justifyContent: centerContent(column.value) ? "center" : "flex-start",
                  width: column.fixedWidth ? column.width : "100%",
                  maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1"
                }} key={`header-column-${i}`}>{column.label}</TableData>
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
                  const editingObj = editing[prod.frontID];
                  const isEditing = Boolean(editingObj);

                  if (column.value === "subTotal") {
                    return (
                      <TableData key={`row-${index}-${i}`}
                        style={{
                          textAlign: centerContent(column.value) ? "center" : "left",
                          justifyContent: centerContent(column.value) ? "center" : "flex-start", width: column.fixedWidth ? column.width : "100%", maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1"
                        }}>{TableRenderUI(column.value, prod.getSubTotal())}</TableData>
                    );
                  }

                  if (column.value === "menu") {
                    return (
                      <TableData key={`row-${index}-${i}`}
                      style={{
                        textAlign: centerContent(column.value) ? "center" : "left",
                        justifyContent: "flex-end", width: column.fixedWidth ? column.width : "100%", maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1"
                      }}
                      >
                        {isEditing ? (
                          <>
                            <IconButton onClick={() => confirmEditRow(prod.frontID)} disabled={[NaN, 0].includes(parseInt(editingObj?.quantity))}>
                              <Check />
                            </IconButton>
                            <IconButton onClick={() => cancelEditRow(prod.frontID)}>
                              <Clear />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton onClick={(e) => MenuActions.open(e, index)}>
                            <MoreVert />
                          </IconButton>
                        )}
                      </TableData>
                    );
                  }

                  if(isEditing) {
                    return (
                      <TableData
                        key={`row-${index}-${i}`}
                        style={{
                          textAlign: centerContent(column.value) ? "center" : "left",
                          justifyContent: centerContent(column.value) ? "center" : "flex-start",
                          width: column.fixedWidth ? column.width : "100%",
                          maxWidth: column.fixedWidth ? column.width : "auto",
                          flex: column.fixedWidth ? "none" : "1",
                          overflow: 'hidden'
                        }}
                      >
                        {column.value === "expiry" && (
                          <TextField
                            type="date"
                            style={{ flex: 1 }}
                            size='small'
                            variant='standard'
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={editingObj.expiry}
                            onChange={e => handleChangeRowProps(prod.frontID, "expiry", e.target.value)}
                          />
                        )}
                        {column.value === "priceBuy" && (
                          <TextField
                            value={editingObj.priceBuy}
                            style={{ flex: 1 }}
                            name={"priceBuy"}
                            variant='standard'
                            size='small'
                            onChange={(e) => {
                              handleChangeRowProps(prod.frontID, "priceBuy", e.target.value);
                            }}
                            Input
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        )}
                        {column.value === "priceSell" && (
                          <TextField
                            value={editingObj.priceSell}
                            variant='standard'
                            style={{ flex: 1 }}
                            name={"priceSell"}
                            size='small'
                            onChange={(e) => {
                              handleChangeRowProps(prod.frontID, "priceSell", e.target.value);
                            }}
                            Input
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                          />
                        )}
                        {column.value === "quantity" && (
                          <TextField
                            variant='standard'
                            value={editingObj.quantity}
                            size='small'
                            onChange={e => handleChangeRowProps(prod.frontID,"quantity", e.target.value)}
                            type="number"
                            error={error.includes("quantity")}
                            style={{ flex: 1 }}
                            inputProps={{ className: "removeArrowsNumber" }}
                          />
                        )}
                        {column.value === "name" && (
                          <TableData
                            key={`row-${index}-${i}`}
                            style={{
                              textAlign: centerContent(column.value) ? "center" : "left",
                              justifyContent: centerContent(column.value) ? "center" : "flex-start",
                              width: column.fixedWidth ? column.width : "100%",
                              maxWidth: column.fixedWidth ? column.width : "auto",
                              flex: column.fixedWidth ? "none" : "1",
                              overflow: 'hidden'
                            }}
                          >
                            <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, prod[column.value])} />
                          </TableData>
                        )}
                      </TableData>
                    );
                  }

                  return (
                    <TableData
                      key={`row-${index}-${i}`}
                      style={{
                        textAlign: centerContent(column.value) ? "center" : "left",
                        justifyContent: centerContent(column.value) ? "center" : "flex-start",
                        width: column.fixedWidth ? column.width : "100%",
                        maxWidth: column.fixedWidth ? column.width : "auto",
                        flex: column.fixedWidth ? "none" : "1",
                        overflow: 'hidden'
                      }}
                    >
                      <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, prod[column.value])} />
                    </TableData>
                  );
                })}
              </TableRow>
            ))}
            <TableRow style={{ borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => (
                <TableData style={{ justifyContent: column.fixedWidth ? "center" : "left", width: column.fixedWidth ? column.width : "100%", maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1" }} key={`column-${i}`}>{ }</TableData>
              ))}
            </TableRow>
          </div>
        </TableContainer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            label="Observação"
            InputLabelProps={{
              shrink: true,
            }}
            style={{flexBasis: "50%"}}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            label={"Total"}
            variant='standard'
            disabled
            value={productsToAdd.length > 0 ? `${total(productsToAdd)}` : "0"}
            style={{ width: 150 }}
            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <Button variant="contained" onClick={handleAddQuantity} disabled={productsToAdd.length === 0 || Boolean(Object.keys(editing).length)}>Confirmar</Button>
      </div>

      {menu.anchor !== null && (
        <Menu
          id="simple-menu"
          anchorEl={menu.anchor}
          keepMounted
          open
          onClose={MenuActions.close}
        >
          <MenuItem onClick={() => handleStartEditing(menu.index)}>Editar</MenuItem>
          <MenuItem onClick={() => handleDeleteProduct(menu.index)}>Excluir</MenuItem>
        </Menu>
      )}
    </div>
  );
}
