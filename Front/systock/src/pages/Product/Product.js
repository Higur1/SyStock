import React, { useContext, useEffect, useRef, useState } from "react";
import { Container } from "./styles";
import { Box, Button, Chip, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Tab, Tabs } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateProductDialog from "./dialogs/CreateProductDialog";
import CustomizedSnackbars from "../../components/CustomizedSnackBar";
import EditProductDialog from "./dialogs/EditProductDialog";
import CircularLoading from "../../components/common/CircularLoading";
import AddSupply from "./dialogs/AddSupply";
import { formatDate } from "../../utils/utils";
import ProductList from "./tabs/productList";
import { ProductContext } from "./ProductPage";
import DeleteProductDialog from "./dialogs/DeleteProductDialog";
import ViewSupplies from "./tabs/ViewSupplies";
import ViewProducts from "./dialogs/ViewProducts";
import ChangeQuantityProduct from "./tabs/ChangeQuantityProductDialog";


export const TABS = {
  PRODUCTS_LIST: "PRODUCTS_LIST",
  CREATE_PRODUCT: "CREATE_PRODUCT",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
  VIEW_SUPPLIES: "VIEW_SUPPLIES",
  ADD_QUANTITY: "ADD_QUANTITY"
}


const TYPES_DIALOG = {
  NONE: 0,
  EDIT_PRODUCT: 3,
  DELETE_PRODUCT: 4,
  VIEW_SUPPLIES: 5,
  VIEW_PRODUCTS: 6
}

const tabsList = [
  { type: TABS.PRODUCTS_LIST, label: "Lista de Produtos" },
  { type: TABS.CREATE_PRODUCT, label: "Criar Produto" },
  { type: TABS.DECREASE_QUANTITY, label: "Diminuir Quantidade" },
  { type: TABS.VIEW_SUPPLIES, label: "Visualizar Abastecimentos" },
  { type: TABS.ADD_QUANTITY, label: "Adicionar Quantidade" }
];

export default function Product() {
  const isMountRef = useRef(false);

  const { productsFiltered, createProduct, errorInsert, updateProduct, loadProducts, loadSupplies } = useContext(ProductContext);

  const [dialog, setDialog] = useState({ type: TYPES_DIALOG.NONE });
  const [tab, setTab] = useState(TABS.PRODUCTS_LIST);
  
  useEffect(() => {
    if(!isMountRef) return;
    if(!isMountRef.current) return;
    if(tab === TABS.VIEW_SUPPLIES) loadSupplies();
    if(tab !== TABS.PRODUCTS_LIST) return;
    loadProducts();
  }, [tab]);

  useEffect(() => {
    isMountRef.current = true;
  }, []); 

  function handleEditProductDialog(index) {
    setDialog({ type: TYPES_DIALOG.EDIT_PRODUCT, index });
  }

  function handleDeleteProductDialog(index) {
    setDialog({ type: TYPES_DIALOG.DELETE_PRODUCT, index });
  }

  function closeDialog() {
    setDialog({ type: TYPES_DIALOG.NONE });
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  function handleViewProducts(supply) {
    setDialog({ type: TYPES_DIALOG.VIEW_PRODUCTS, supply});
  }

  return (
    <>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column', width: "100%", gridArea: "tab" }}>
          <Tabs onChange={handleChange} value={tab}>
            {tabsList.map((tab, i) => (<Tab label={tab.label} value={tab.type} key={i} />))}
          </Tabs>
          <Divider />
        </div>

        <div style={{ gridArea: "tabcontent", overflow: 'hidden' }}>
          {tab === TABS.PRODUCTS_LIST && (
            <ProductList
              handleEditProductDialog={handleEditProductDialog}
              handleDeleteProductDialog={handleDeleteProductDialog}
            />
          )}

          {tab === TABS.CREATE_PRODUCT && (
            <CreateProductDialog
              handleCreate={(prod) => {
                createProduct(prod);
              }}
              error={errorInsert}
            />
          )}

          {tab === TABS.ADD_QUANTITY && (<AddSupply onClose={() => handleChange(null, TABS.PRODUCTS_LIST)}/>)}

          {tab === TABS.DECREASE_QUANTITY && (<ChangeQuantityProduct />)}

          {tab === TABS.VIEW_SUPPLIES && (<ViewSupplies handleViewProducts={handleViewProducts}/>)}
        </div>
      </Container >

      {(dialog.type === TYPES_DIALOG.EDIT_PRODUCT) && <EditProductDialog
        handleEdit={(prod) => {
          updateProduct(prod);
          closeDialog();
        }}
        handleClose={closeDialog}
        error={errorInsert}
        open
        product={productsFiltered[dialog.index]}
      />
      }

      {dialog.type === TYPES_DIALOG.DELETE_PRODUCT && (<DeleteProductDialog closeDialog={closeDialog} index={dialog.index} />)}

      {dialog.type === TYPES_DIALOG.VIEW_PRODUCTS && (<ViewProducts supply={dialog.supply} onClose={closeDialog} />)}
    </>
  )
}

