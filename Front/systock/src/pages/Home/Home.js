import { Error } from '@mui/icons-material';
import { Link, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SupplierFastViewDialog from '../Supplier/dialogs/SupplierFastViewDialog';
import { ENTITIES, getData, getDB } from '../../utils/debug-local-helper';
import CircularLoading from '../../components/common/CircularLoading';
import { addSuppliersEntityToProducts } from '../../utils/utils';

export const ADVICE_VARIANT = {
  "ERROR": 0,
  "WARNING": 1,
  "SUCCESS": 2
};

export const ADVICE_TYPE = {
  PRODUCT_ENDING: 0
}

export default function Home() {
  
  const [advices, setAdvices] = useState(null);
  const [suppliersDialog, setSuppliersDialog] = useState({open: false, obj: null});
  const [quantityAdvice, setQuantityAdvice] = useState(0);  

  useEffect(() => {
    handleInitialData();
  }, []);

  useEffect(() => {
    getAdvices();
  }, [quantityAdvice]);

  function getAdvices() {
    const { products, suppliers } = getDB();

    const arrProducts = addSuppliersEntityToProducts(products, suppliers).filter(obj => obj.quantity < quantityAdvice);

    const nextAdvices = arrProducts.map(obj => ({
      typeVariant: ADVICE_VARIANT.ERROR,
      adviceType: ADVICE_TYPE.PRODUCT_ENDING,
      productAdvice: obj
    }));

    setAdvices(nextAdvices);
  }

  function handleInitialData() {
    const homeObject = getData(ENTITIES.HOME_PAGE);

    setQuantityAdvice(homeObject);
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <TextField style={{width: 400}} InputProps={{type: "number"}} label={"Avisar-me sobre produtos com a quantidade menor que:"} onChange={e => setQuantityAdvice(e.target.value)}>{quantityAdvice}</TextField>
        </div>
        <h1>Avisos</h1>
        
        <div className="customScroll">
          {advices === null && (
            <CircularLoading />
          )}
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
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
          </div>
          
        </div>
      </div>
      {suppliersDialog.open && (<SupplierFastViewDialog obj={suppliersDialog.obj} onClose={closeSuppliers}/>)}
    </>
    
  )
}
