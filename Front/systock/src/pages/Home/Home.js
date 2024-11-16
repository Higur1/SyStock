import { Launch, Visibility } from '@mui/icons-material';
import { IconButton} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import ViewAdvicesDialog from '../Supplier/dialogs/ViewAdvicesDialog';
import { DEBUG_LOCAL, MainContext } from '../../App';
import ProductActions from '../../Service/Product/ProductActions';
import CategoryActions from '../../Service/Category/CategoryActions';
import { FILTER_TYPES } from '../Product/tabs/productList';

export const ADVICE_VARIANT = {
  "ERROR": 0,
  "WARNING": 1,
  "SUCCESS": 2
};

export default function Home() {
  const { handleOpenSnackBar, redirectToListProductsFiltered } = useContext(MainContext);
  
  // const [suppliersDialog, setSuppliersDialog] = useState({open: false, obj: null});
  const [table, setTable] = useState([
    {
      type: FILTER_TYPES.EXPIRED,
      list: [],
      label: "Vencidos"
    },
    {
      type: FILTER_TYPES.EMPTY,
      list: [],
      label: "Estoque Zerado"
    },
    {
      type: FILTER_TYPES.NEXT_TO_EXPIRY,
      list: [],
      label: "Próximos ao vencimento"
    },
    {
      type: FILTER_TYPES.LOW_QUANTITY,
      list: [],
      label: "Baixa Quantidade"
    },
  ]);
  const [openDialogViewAdvices, setOpenDialogViewAdvices] = useState({open: false, obj: null});

  useEffect(() => {
    handleInitialData();
  }, []);

  async function getAdvices() {
    try {
      const categories = await CategoryActions.getAll();
      const productsExpired = await ProductActions.getAllExpired(categories);
      const productsEmpty = await ProductActions.getAllEmpty(categories);
      const productsCloseToExpiry = await ProductActions.getAllCloseToExpiry(categories);
      const productsLowQuantity = await ProductActions.getAllLowQuantity(categories);

      setTable(prevTable => prevTable.map(table => {
        switch(table.type) {
          case FILTER_TYPES.EMPTY: {
            return {...table, list: productsEmpty};
          }
          case FILTER_TYPES.LOW_QUANTITY: {
            return {...table, list: productsLowQuantity};
          }
          case FILTER_TYPES.EXPIRED: {
            return {...table, list: productsExpired};
          }
          case FILTER_TYPES.NEXT_TO_EXPIRY: {
            return {...table, list: productsCloseToExpiry};
          }
          default: return table;
        }
      }));
    } catch (e) {
      handleOpenSnackBar("error", e);
    }
  }

  function handleInitialData() {
    getAdvices();
  }

  // function openSuppliers(obj) {
  //   setSuppliersDialog({open: true, obj});
  // }

  // function closeSuppliers() {
  //   setSuppliersDialog({open: false, obj: null});
  // }

  return (
    <>
      <div style={{padding: 32, display: 'flex', flexDirection: 'column', gap: 16}}>
        <h1>Avisos</h1>
        
        <div className="customScroll" style={{display: 'flex', justifyContent: 'center'}}>
          {/* <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {(advices !== null && advices.length > 0) && advices.map((advice, index) => {

              const { name, quantity, suppliers } = advice.productAdvice;

              // const red = FF7657;

              return (
                <div style={{display: 'flex', gap: 16, alignItems: 'center', borderRadius: 16, background: "rgb(155 0 0)", color: "#f5f5f5", padding: "16px"}} key={index}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16}}>
                    <Error fontSize='large'/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', width: "100%", gap: 8}} key={index}>
                    <div>O produto <strong>{name}</strong> está acabando no seu estoque! Existem somente <strong>{quantity}</strong> unidades.</div>
                    <div style={{color: "#f5f5f5", textDecorationColor: "#f5f5f5", textDecorationLine: "underline",cursor: "pointer"}} onClick={() => openSuppliers(advice.productAdvice)}>Clique aqui para ver informações dos seus fornecedores deste produto. E entre em contato com eles.</div>
                  </div>
                </div>
              );
              })}
          </div> */}
          <div style={{display: 'flex', flexDirection: 'column', border: '1px solid #DCDCDC', borderRadius: 8, width: "70%"}}>
            <div style={{display: 'flex', height: 48, alignItems: 'center', fontWeight: 600}}>
              <div style={{flex: 1, textAlign: 'center'}}>
                <span>{"Produtos"}</span>
              </div>
              <div style={{flexBasis: "35%", textAlign: 'center'}}>
                <span>{"Quantidade"}</span>
              </div>
              <div style={{flexBasis: "20%", textAlign: 'center'}}>
                <span>{"Visualizar"}</span>
              </div>
            </div>
            {table.map((item, i) => (
              <div style={{display: 'flex', height: 48, alignItems: 'center', borderTop: '1px solid #DCDCDC'}} key={i}>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <span>{item.label}</span>
                </div>
                <div style={{flexBasis: "35%", textAlign: 'center'}}>
                  <span>{item.list.length}</span>
                </div>
                <div style={{flexBasis: "20%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <IconButton onClick={() => redirectToListProductsFiltered(item.type)} disabled={item.list.length === 0}>
                    <Launch />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
      {openDialogViewAdvices.open && (<ViewAdvicesDialog obj={openDialogViewAdvices.obj} onClose={() => setOpenDialogViewAdvices({open: false, obj: null})}/>)}
      {/* {suppliersDialog.open && (<SupplierFastViewDialog obj={suppliersDialog.obj} onClose={closeSuppliers}/>)} */}
    </>
    
  )
}
