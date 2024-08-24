import React, { useContext, useState } from "react";
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


export const TABS = {
  PRODUCTS_LIST: "PRODUCTS_LIST",
  CREATE_PRODUCT: "CREATE_PRODUCT",
  CHANGE_QUANTITY: "CHANGE_QUANTITY",
  VIEW_SUPPLIES: "VIEW_SUPPLIES",
  ADD_SUPPLY: "ADD_SUPPLY"
}


const TYPES_DIALOG = {
  NONE: 0,
  EDIT_PRODUCT: 3,
  DELETE_PRODUCT: 4,
  VIEW_SUPPLIES: 5
}

const tabsList = [
  {type: TABS.PRODUCTS_LIST, label: "Lista de Produtos"},
  {type: TABS.CREATE_PRODUCT, label: "Criar Produto"},
  {type: TABS.CHANGE_QUANTITY, label: "Alterar Quantidade"},
  {type: TABS.VIEW_SUPPLIES, label: "Visualizar Abastecimentos"},
  {type: TABS.ADD_SUPPLY, label: "Adicionar Abastecimento"}
];

export default function Product() {

  const { productsFiltered, createProduct, errorInsert, updateProduct } = useContext(ProductContext);

  const [dialog, setDialog] = useState({ type: TYPES_DIALOG.NONE});
  const [tab, setTab] = useState(TABS.PRODUCTS_LIST);

  function handleQuantityDialog(index) {
    setDialog({ type: TYPES_DIALOG.ADD_PRODUCT, index});
  }

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

  return (
    <>
      <Container>
        <div style={{display: 'flex', flexDirection: 'column', width: "100%", gridArea: "tab"}}>
          <Tabs onChange={handleChange} value={tab}>
            {tabsList.map((tab, i) => (<Tab label={tab.label} value={tab.type} key={i} />))}
          </Tabs>
          <Divider />
        </div>

        <div style={{gridArea: "tabcontent"}}>
          {tab === TABS.PRODUCTS_LIST && (
            <ProductList 
              handleQuantityDialog={handleQuantityDialog} 
              handleEditProductDialog={handleEditProductDialog}
              handleDeleteProductDialog={handleDeleteProductDialog}
            />
          )}

          {tab === TABS.ADD_SUPPLY && (<AddSupply onConfirm={() => {}} onClose={closeDialog} />)}
        </div>
      </Container >

      {dialog.type === TYPES_DIALOG.ADD_PRODUCT && <CreateProductDialog
        handleCreate={(prod) => {
          createProduct(prod);
          closeDialog();
        }}
        handleClose={closeDialog}
        error={errorInsert}
        open  
      />}

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

      { dialog.type === TYPES_DIALOG.DELETE_PRODUCT && (<DeleteProductDialog closeDialog={closeDialog} index={dialog.index}/>)}

    </>
  )
}

  