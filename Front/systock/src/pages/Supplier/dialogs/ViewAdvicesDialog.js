import { Title, Visibility } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

export default function ViewAdvicesDialog(props) {

  const { onClose, obj, openSuppliers } = props;
  const { label, list } = obj; 

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>{`Produtos - ${label}`}</DialogTitle>
      <DialogContent>
        <div style={{display: 'flex', flexDirection:' column', width: "100%", height: "100%", gap: 16}}>

          <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{display: 'flex', alignItems: 'center', height: 48, width: "100%", borderBottom: "2px solid #DCDCDC"}}>
              <div style={{width: 36}} />
              <div style={{display: 'flex',alignItems: 'center', flex: 1, fontWeight: 700}}>{"Produto"}</div>
              <div style={{display: 'flex',alignItems: 'center', flexBasis: 150, fontWeight: 700, justifyContent: 'center'}}>{"Quantidade"}</div>
              <div style={{display: 'flex',alignItems: 'center', flexBasis: 150, fontWeight: 700, justifyContent: 'center'}}>{"Validade"}</div>
              {/* <div style={{display: 'flex',alignItems: 'center', flexBasis: 100, fontWeight: 700}}>{"Fornecedores"}</div> */}
            </div>
            {list.map((product, index) => (
              <div style={{display: 'flex', alignItems: 'center', height: 48, border: "1px solid #dcdcdc", width: "100%", borderRadius: 16}}>
                <div style={{textAlign: 'center', width: 36}}>{index + 1}</div>
                <div style={{display: 'flex',alignItems: 'center', flex: 1, fontWeight: 500}}>{product.name}</div>
                <div style={{display: 'flex',alignItems: 'center', flexBasis: 150, justifyContent: 'center'}}>{product.quantity}</div>
                <div style={{display: 'flex',alignItems: 'center', flexBasis: 150, justifyContent: 'center'}}>{product.expiry.toLocaleDateString()}</div>
                {/* <div style={{display: 'flex',alignItems: 'center', flexBasis: 100}}>
                  <IconButton onClick={() => openSuppliers(product.productAdvice)}>
                    <Visibility />
                  </IconButton>
                </div> */}
              </div>
            ))}
            
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  )
}
