import { Title } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

export default function SupplierFastViewDialog() {
  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle><Title>{"Fornecedores Disponíveis"}</Title></DialogTitle>
      <DialogContent>
        <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: 'column'}}>
          teste
        </div>
      </DialogContent>
    </Dialog>
  )
}
