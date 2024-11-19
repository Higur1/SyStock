import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "./styles";
import { Divider, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import CreateProduct from "./dialogs/CreateProduct";
import EditProductDialog from "./dialogs/EditProductDialog";
import ProductList from "./tabs/productList";
import { ProductContext } from "./ProductPage";
import DeleteProductDialog from "./dialogs/DeleteProductDialog";
import ViewSupplies from "./tabs/ViewSupplies";
import ViewProductsBySupply from "./dialogs/ViewProductsBySupply";
import DecreaseQuantityProduct from "./tabs/DecreaseQuantityProduct";
import IncreaseQuantity from "./tabs/IncreaseQuantity";
import ViewProductBatchsDialog from "./dialogs/ViewProductBatchsDialog";


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
  VIEW_PRODUCTS_BY_SUPPLY: 6,
  VIEW_PRODUCT_BATCHS: 7
}

const tabsList = [
  { type: TABS.PRODUCTS_LIST, label: "Lista de Produtos" },
  { type: TABS.CREATE_PRODUCT, label: "Criar Produto" },
  { type: TABS.DECREASE_QUANTITY, label: "Diminuir Quantidade" },
  { type: TABS.VIEW_SUPPLIES, label: "Visualizar Abastecimentos" },
  { type: TABS.ADD_QUANTITY, label: "Adicionar Abastecimento" }
];

export default function Product() {
  const isMountRef = useRef(false);

  const { loadProducts } = useContext(ProductContext);

  const [dialog, setDialog] = useState({ type: TYPES_DIALOG.NONE });
  const [tab, setTab] = useState(TABS.PRODUCTS_LIST);
  const [menu, setMenu] = useState({ anchor: null, prod: null });
  
  const MenuActions = useMemo(() => ({
    open: (e, prod) => setMenu({ anchor: e.currentTarget, prod }),
    close: () => setMenu({ anchor: null, prod: null })
  }), []);

  useEffect(() => {
    if(!isMountRef) return;
    if(!isMountRef.current) return;
    if(tab !== TABS.PRODUCTS_LIST) return;
    loadProducts();
  }, [tab]);

  useEffect(() => {
    isMountRef.current = true;
  }, []); 

  function handleEditProductDialog(prod) {
    setDialog({ type: TYPES_DIALOG.EDIT_PRODUCT, prod });
  }

  function handleDeleteProductDialog(prod) {
    setDialog({ type: TYPES_DIALOG.DELETE_PRODUCT, prod });
  }

  function handleViewProductDialog(prod) {
    console.log(prod);
    setDialog({ type: TYPES_DIALOG.VIEW_PRODUCT_BATCHS, prod});
  }

  function closeDialog() {
    MenuActions.close();
    setDialog({ type: TYPES_DIALOG.NONE });
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  function handleViewProducts(supply) {
    setDialog({ type: TYPES_DIALOG.VIEW_PRODUCTS_BY_SUPPLY, supply});
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
          {tab === TABS.PRODUCTS_LIST && (<ProductList openMenu={MenuActions.open} />)}

          {tab === TABS.CREATE_PRODUCT && (
            <CreateProduct onChangeTab={handleChange}/>
          )}

          {tab === TABS.ADD_QUANTITY && (<IncreaseQuantity onClose={() => handleChange(null, TABS.PRODUCTS_LIST)}/>)}

          {tab === TABS.DECREASE_QUANTITY && (<DecreaseQuantityProduct />)}

          {tab === TABS.VIEW_SUPPLIES && (<ViewSupplies handleViewProducts={handleViewProducts}/>)}
        </div>
      </Container >

      {(dialog.type === TYPES_DIALOG.EDIT_PRODUCT) && <EditProductDialog
        handleClose={closeDialog}
        open
        product={dialog.prod}
      />
      }

      {dialog.type === TYPES_DIALOG.DELETE_PRODUCT && (<DeleteProductDialog closeDialog={closeDialog} product={dialog.prod} />)}

      {dialog.type === TYPES_DIALOG.VIEW_PRODUCTS_BY_SUPPLY && (<ViewProductsBySupply supply={dialog.supply} onClose={closeDialog} />)}

      {dialog.type === TYPES_DIALOG.VIEW_PRODUCT_BATCHS && (<ViewProductBatchsDialog product={dialog.prod} onClose={closeDialog}/>)}

      
      {menu.anchor !== null && (
        <Menu
          id="simple-menu"
          anchorEl={menu.anchor}
          keepMounted
          open
          onClose={MenuActions.close}
        >
          <MenuItem onClick={() => handleViewProductDialog(menu.prod)}>Visualizar Lotes do Produto</MenuItem>
          <MenuItem onClick={() => handleEditProductDialog(menu.prod)}>Editar Produto</MenuItem>
          <MenuItem onClick={() => handleDeleteProductDialog(menu.prod)}>Excluir Produto</MenuItem>
        </Menu>
      )}
    </>
  )
}

