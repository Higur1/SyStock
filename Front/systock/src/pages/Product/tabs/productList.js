import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import CircularLoading from '../../../components/common/CircularLoading';
import { ContainerProductsList, MenuOption, TableContainer, TableData, TableRow } from '../styles';
import { ClickAwayListener, Divider, FormControlLabel, IconButton, Menu, MenuItem, Radio, RadioGroup } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProductContext } from '../ProductPage';
import { centerContent, formatDate } from '../../../utils/utils';
import { Delete, Edit, MoreVert, Search } from '@mui/icons-material';
import NoData from '../../../components/common/NoData';
import ProductActions from '../../../Service/Product/ProductActions';
import { MainContext } from '../../../App';
import TableRenderUI from '../../../utils/TableRenderUI';
import CategoryActions from '../../../Service/Category/CategoryActions';
import { useSearchParams } from 'react-router-dom';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';


export const FILTER_TYPES = {
  ALL: "ALL",
  NEXT_TO_EXPIRY: "NEXT_TO_EXPIRY",
  LOW_QUANTITY: "LOW_QUANTITY",
  EMPTY: "EMPTY",
  EXPIRED: "EXPIRED"
};

export const filtersBase = [
  { type: FILTER_TYPES.ALL, value: "Todos" },
  { type: FILTER_TYPES.NEXT_TO_EXPIRY, value: "Próximo do Vencimento" },
  { type: FILTER_TYPES.LOW_QUANTITY, value: "Baixa Quantidade" },
  { type: FILTER_TYPES.EMPTY, value: "Estoque Zerado" },
  { type: FILTER_TYPES.EXPIRED, value: "Vencidos" }
];


const columnsBase = {
  [FILTER_TYPES.ALL]: [
    { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120, },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 150, label: "Preço de Venda", value: "priceBaseSell" },
    { fixedWidth: true, width: 80, label: "Quantidade", value: "totalQuantity" },
    { fixedWidth: true, width: 100, label: "", value: "menu" }
  ],
  [FILTER_TYPES.NEXT_TO_EXPIRY]: [
    { fixedWidth: true, width: 150, label: "Data de Vencimento", value: "expiry" },
    { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 100, label: "Quantidade Total", value: "totalQuantity" },
    { fixedWidth: true, width: 120, label: "Quantidade nessa Validade", value: "totalQuantitySameExpiry" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.LOW_QUANTITY]: [
    { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 120, label: "Quantidade Mínima", value: "minimumQuantity" },
    { fixedWidth: true, width: 80, label: "Quantidade", value: "totalQuantity" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.EMPTY]: [
    { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
  [FILTER_TYPES.EXPIRED]: [
    { fixedWidth: true, width: 150, label: "Data de Vencimento", value: "expiry" },
    { fixedWidth: true, label: "Código de Referência", value: "refCode", width: 120 },
    { fixedWidth: false, width: 200, label: "Nome", value: "name" },
    { fixedWidth: true, width: 200, label: "Categoria", value: "category" },
    { fixedWidth: true, width: 150, label: "Quantidade Total", value: "totalQuantity" },
    { fixedWidth: true, width: 150, label: "Quantidade Vencida", value: "totalQuantitySameExpiry" },
    // { fixedWidth: true, width: 100, label: "Funções", value: "menu" }
  ],
}

export default function ProductList(props) {

  const [searchParams] = useSearchParams();
  const categoriesRef = useRef(null);
  const { handleOpenSnackBar } = useContext(MainContext);
  const { handleEditProductDialog, handleDeleteProductDialog, handleViewProductDialog } = props;

  const [filter, setFilter] = useState(searchParams.get("filter") || FILTER_TYPES.ALL);
  const [products, setProducts] = useState(null);
  const [menu, setMenu] = useState({ anchor: null, prod: null });

  useEffect(() => {
    getCategories();
  }, []);
  
  useEffect(() => {
    if(!categoriesRef.current) return;

    getProducts();
  }, [filter, categoriesRef.current]);

  const columns = useMemo(() => columnsBase[filter], [filter]);
  const MenuActions = useMemo(() => ({
    open: (e, prod) => setMenu({ anchor: e.currentTarget, prod }),
    close: () => setMenu({ anchor: null, prod: null })
  }), []);

  async function get(categoriesList) {
    switch (filter) {
      case FILTER_TYPES.EMPTY: return await ProductActions.getAllEmpty(categoriesList);
      case FILTER_TYPES.EXPIRED: return await ProductActions.getAllExpired(categoriesList);
      case FILTER_TYPES.LOW_QUANTITY: return await ProductActions.getAllLowQuantity(categoriesList);
      case FILTER_TYPES.NEXT_TO_EXPIRY: return await ProductActions.getAllCloseToExpiry(categoriesList);
      case FILTER_TYPES.ALL:
      default: return await ProductActions.getAll(categoriesList);
    }
  }

  async function getCategories() {
    try {
      const categories = await CategoryActions.getAll();

      categoriesRef.current = categories;
    } catch (e) {
      console.log(e);
      handleOpenSnackBar("error", e);
    }
  }

  async function getProducts() {
    setProducts(null);
    try {
      const products = await get(categoriesRef.current);
      setProducts(products);
    } catch (error) {
      console.log(error);
      setProducts([]);
      handleOpenSnackBar("error", error, 3500);
    }
  }

  const loading = products === null;

  return (
    <ContainerProductsList>
      {/* <span style={{ fontWeight: 600 }}>Filtros</span>
      <RadioGroup row aria-label="position" name="position" value={filter} onChange={(_, value) => setFilter(value)}>
        {filtersBase.map((filter, i) => (
          <FormControlLabel
            key={`filter-${i}`}
            value={filter.type}
            control={<Radio color="primary" />}
            label={filter.value}
            labelPlacement="bottom"
          />
        ))}
      </RadioGroup>

      <Divider /> */}
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {loading ? (
          <CircularLoading />
        ) : (
          <TableContainer>
            <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
              {columns.map((column, i) => (
                <TableData style={{ 
                  textAlign: centerContent(column.value) ? "center" : "left", 
                  justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                  width: column.fixedWidth ? column.width : "100%", 
                  maxWidth: column.fixedWidth ? column.width : "auto", 
                  flex: column.fixedWidth ? "none" : "1" 
                }} 
                key={`header-column-${i}`}>{column.label}</TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {Boolean(products.length === 0) && (
                <NoData />
              )}
              {(products.length > 0) && products.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === products.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === products.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                }}>
                  {columns.map((column, i) => {

                    if (column.value === "menu") {
                      return (
                        <TableData style={{ justifyContent: 'center', gap: 8, width: column.width, maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1" }} key={`row-${index}-${i}`}>
                          <IconButton onClick={(e) => MenuActions.open(e, prod)}>
                            <MoreVert />
                          </IconButton>
                        </TableData>
                      )
                    }
                    return (
                      <TableData 
                        key={`row-${index}-${i}`} 
                        style={{ 
                          textAlign: centerContent(column.value) ? "center" : "left", 
                          justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                          width: column.fixedWidth ? column.width : "100%", 
                          maxWidth: column.fixedWidth ? column.width : "auto", 
                          flex: column.fixedWidth ? "none" : "1" ,
                          overflow:'hidden'
                        }}
                      >
                        <TooltipAndEllipsis item={TableRenderUI(column.value, prod[column.value])} centerText={centerContent(column.value)}/>
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </TableContainer>
        )
        }
      </div>

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
    </ContainerProductsList>
  )
}