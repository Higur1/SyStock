import { Title } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import Batch from '../../../classes/Batch';

export default function SupplierFastViewDialog(props) {

  const { onClose, obj = new Batch() } = props;
  const { suppliers, name, quantity} = obj; 

  console.log(suppliers);
  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>{"Fornecedores Disponíveis"}</DialogTitle>
      <DialogContent>
        <div style={{display: 'flex', flexDirection:' column', width: "100%", height: "100%", gap: 16}}>
          
          <span style={{fontWeight: 500}}>{"Fornecedores disponíveis para o produto:"}<strong>{` ${name}`}</strong></span>

          <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{display: 'flex', alignItems: 'center', height: 48, width: "100%", borderBottom: "2px solid #DCDCDC"}}>
              <div style={{width: 36}} />
              <div style={{display: 'flex',alignItems: 'center', flex: 1, fontWeight: 700}}>{"Nome"}</div>
              <div style={{display: 'flex',alignItems: 'center', flexBasis: 150, fontWeight: 700}}>{"Telefone"}</div>
              <div style={{display: 'flex',alignItems: 'center', flexBasis: 250, fontWeight: 700}}>{"E-mail"}</div>
            </div>
            {suppliers.map((sup, index) => (
              <div style={{display: 'flex', alignItems: 'center', height: 48, border: "1px solid #dcdcdc", width: "100%", borderRadius: 16}} key={index}>
                <div style={{textAlign: 'center', width: 36}}>{index + 1}</div>
                <div style={{display: 'flex',alignItems: 'center', flex: 1, fontWeight: 500}}>{sup.name}</div>
                <div style={{display: 'flex',alignItems: 'center', flexBasis: 150}}>{sup.phone}</div>
                <div style={{display: 'flex',alignItems: 'center', flexBasis: 250}}>{sup.email}</div>
              </div>
            ))}
            
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  )
}
