import { Error, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Link, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SupplierFastViewDialog from '../Supplier/dialogs/SupplierFastViewDialog';
import { ENTITIES, getData, getDB } from '../../utils/debug-local-helper';
import CircularLoading from '../../components/common/CircularLoading';
import { addSuppliersEntityToProducts } from '../../utils/utils';
import ViewAdvicesDialog from '../Supplier/dialogs/ViewAdvicesDialog';

export const ADVICE_VARIANT = {
  "ERROR": 0,
  "WARNING": 1,
  "SUCCESS": 2
};

export const ADVICE_TYPE = {
  PRODUCT_ENDING: 0,
  PRODUCT_EXPIRED: 1,
  PRODUCT_EMPTY: 2,
  PRODUCT_NEXT_TO_EXPIRE: 3
};

export default function Home() {
  
  const [suppliersDialog, setSuppliersDialog] = useState({open: false, obj: null});
  const [table, setTable] = useState([
    {
      type: ADVICE_TYPE.PRODUCT_EXPIRED,
      list: [],
      label: "Vencidos"
    },
    {
      type: ADVICE_TYPE.PRODUCT_EMPTY,
      list: [],
      label: "Estoque Zerado"
    },
    {
      type: ADVICE_TYPE.PRODUCT_NEXT_TO_EXPIRE,
      list: [],
      label: "Próximos ao vencimento"
    },
    {
      type: ADVICE_TYPE.PRODUCT_ENDING,
      list: [],
      label: "Baixa Quantidade (Quantidade menor que 20)"
    },
  ]);
  const [openDialogViewAdvices, setOpenDialogViewAdvices] = useState({open: false, obj: null});

  useEffect(() => {
    handleInitialData();
  }, []);


  function getAdvices() {
    const { products, suppliers } = getDB();

    const arrProducts = addSuppliersEntityToProducts(products, suppliers);

    setTable(prevTable => prevTable.map(table => {
      switch(table.type) {
        case ADVICE_TYPE.PRODUCT_EMPTY: {
          const list = arrProducts.filter(product => product.quantity === 0);

          return {...table, list};
        }
        case ADVICE_TYPE.PRODUCT_ENDING: {
          const list = arrProducts.filter(product => product.quantity < 20);

          return {...table, list};
        }
        case ADVICE_TYPE.PRODUCT_EXPIRED: {
          const list = arrProducts.filter(product => product.expiry <= new Date());

          return {...table, list};
        }
        case ADVICE_TYPE.PRODUCT_NEXT_TO_EXPIRE: {
          const daysDiff = 7;
          const nextDay = new Date();
          nextDay.setDate(new Date().getDate() + daysDiff);
          const list = arrProducts.filter(product => (nextDay - product.expiry) < daysDiff);

          return {...table, list};
        }
        default: return table;
      };
    }));
  }

  function handleInitialData() {
    // const homeObject = getData(ENTITIES.HOME_PAGE);

    // setQuantityAdvice(homeObject);
    getAdvices();
  }

  function openSuppliers(obj) {
    setSuppliersDialog({open: true, obj});
  }

  function closeSuppliers() {
    setSuppliersDialog({open: false, obj: null});
  }

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
                  <IconButton onClick={() => setOpenDialogViewAdvices({open: true, obj: item})} disabled={item.list.length === 0}>
                    <Visibility />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
      {openDialogViewAdvices.open && (<ViewAdvicesDialog obj={openDialogViewAdvices.obj} openSuppliers={openSuppliers} onClose={() => setOpenDialogViewAdvices({open: false, obj: null})}/>)}
      {suppliersDialog.open && (<SupplierFastViewDialog obj={suppliersDialog.obj} onClose={closeSuppliers}/>)}
    </>
    
  )
}
