import { Error } from '@mui/icons-material';
import { Link } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import SupplierFastViewDialog from '../Supplier/dialogs/SupplierFastViewDialog';

export const ADVICE_VARIANT = {
  "ERROR": 0,
  "WARNING": 1,
  "SUCCESS": 2
};

export const ADVICE_TYPE = {
  PRODUCT_ENDING: 0
}

export default function Home() {
  
  const [advices, setAdvices] = useState([
    { 
      typeVariant: ADVICE_VARIANT.ERROR,
      adviceType: ADVICE_TYPE.PRODUCT_ENDING,
      productAdvice: {
        productName: "Cimento",
        quantity: 2,
        suppliers: [{
          name: "f1",
          email: "f1@gmail.com",
          tel1: "11998123281",
          tel2: "11912948129",
          address: "rua 1, 42"
        }]
      }
    }
  ]);
  const [suppliersDialog, setSuppliersDialog] = useState({open: false, suppliers: null});

  function openSuppliers(suppliers) {
    setSuppliersDialog({open: true, suppliers});
  }

  function closeSuppliers() {
    setSuppliersDialog({open: false, suppliers: null});
  }

  return (
    <>
      <div style={{padding: 32, display: 'flex', flexDirection: 'column', gap: 16}}>
        <h1>Avisos</h1>
        
        <div className="customScroll">
          {advices.map((advice, index) => {

            const { productName, quantity, suppliers } = advice.productAdvice;

            // const red = FF7657;

            return (
              <div style={{display: 'flex', gap: 16, alignItems: 'center', borderRadius: 16, background: "rgb(155 0 0)", color: "#f5f5f5", padding: "16px"}} key={index}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16}}>
                  <Error fontSize='large'/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: "100%", gap: 8}} key={index}>
                  <div>O produto <strong>{productName}</strong> está acabando no seu estoque! Existem somente <strong>{quantity}</strong> unidades.</div>
                  <Link href="" style={{color: "#f5f5f5", textDecorationColor: "#f5f5f5"}} onClick={() => openSuppliers(suppliers)}>Clique aqui para ver informações dos seus fornecedores deste produto. E entre em contato com eles.</Link>
                </div>
              </div>
              
            );
          })}
        </div>
      </div>
      <SupplierFastViewDialog />
    </>
    
  )
}
