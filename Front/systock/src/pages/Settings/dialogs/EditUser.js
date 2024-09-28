import { Close, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import React from 'react'
import styled from 'styled-components';

export const TYPE_USER_DIALOG = {
  NEW: "NEW",
  EDIT: "EDIT",
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px;
`

export default function EditUser({ type }) {

  const isEditUser = type === TYPE_USER_DIALOG.EDIT;

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{isEditUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      <Divider />
      <DialogContent style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 8}}>
        {!isEditUser && (<span style={{fontWeight: 500}}>Autorizar primeiro acesso ao usuário</span>)}
        <Container>
          <TextField disabled={isEditUser} label="Nome" style={{ gridArea: "name" }} />
          <TextField label="E-mail" style={{ gridArea: "email" }} />
          {isEditUser && <Button size="small" style={{ gridArea: "redefinePassword" }}>Redefinir Senha</Button>}
        </Container>
      </DialogContent>
      
      <DialogActions>
        <Button startIcon={<Close />}>Cancelar</Button>
        <Button variant="contained" startIcon={<Save />}>Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}
