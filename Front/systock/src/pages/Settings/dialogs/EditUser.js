import { Close, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components';
import Account from '../../../classes/Account';

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

export default function EditUserDialog({ type, user: account = new Account({}), handleConfirm, onClose }) {

  const [user, setUser] = useState({name: account.name, email: account.email, username: account.user, password: account.password});
  const isEditUser = type === TYPE_USER_DIALOG.EDIT;

  function onChange(type, value) {
    setUser(prevUser => ({...prevUser, [type]: value}));
  }

  function onConfirm() {
    const nextAccount = new Account({...account});

    nextAccount.name = user.name;
    nextAccount.email = user.email;
    nextAccount.user = user.username;
    nextAccount.password = user.password;

    handleConfirm(nextAccount);
  }

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{isEditUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      <Divider />
      <DialogContent style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 8}}>
        {!isEditUser && (<span style={{fontWeight: 500}}>Autorizar primeiro acesso ao usuário</span>)}
        <Container>
          {!isEditUser ? (
            <>
              <TextField label="Nome" style={{ gridArea: "name" }} value={user.name} onChange={(e) => onChange("name", e.target.value)}/>
              <TextField label="E-mail" style={{ gridArea: "email" }} value={user.email} onChange={(e) => onChange("email", e.target.value)}/>
            </>
          ) : (
            <>
              <TextField label="Nome" disabled style={{ gridArea: "name" }} value={user.name} onChange={(e) => onChange("name", e.target.value)}/>
              <TextField label="Username" disabled style={{ gridArea: "username" }} value={user.username} onChange={(e) => onChange("username", e.target.value)}/>
              <TextField label="E-mail" style={{ gridArea: "email" }} value={user.email} onChange={(e) => onChange("email", e.target.value)}/>
              <TextField label="Senha" style={{ gridArea: "email" }} value={user.password} onChange={(e) => onChange("password", e.target.value)} type="password"/>
            </>
          )}
        </Container>
      </DialogContent>
      
      <DialogActions>
        <Button startIcon={<Close />} onClick={onClose}>Cancelar</Button>
        <Button variant="contained" startIcon={<Save />} onClick={onConfirm}>Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}
