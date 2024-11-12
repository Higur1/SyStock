import { Close, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import styled from 'styled-components';
import Account from '../../../classes/Account';
import UsersActions from '../../../Service/Users/UsersActions';
import { MainContext } from '../../../App';
import useValidateForm, { FORM_TYPE } from '../../../hooks/useValidateForm';

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

export default function NewUserDialog({ user: account = new Account({}), onClose }) {

  const { handleOpenSnackBar } = useContext(MainContext);

  const [user, setUser] = useState({ name: account.name, email: account.email, username: account.user, password: account.password });
  const { error, hasError, hasInteracted, hasAnyError } = useValidateForm(user, FORM_TYPE.PREUSER);

  function onChange(type, value) {
    setUser(prevUser => ({ ...prevUser, [type]: value }));
  }

  function onConfirm() {
    const nextAccount = new Account({ ...account });

    nextAccount.name = user.name;
    nextAccount.email = user.email;
    nextAccount.user = user.username;
    nextAccount.password = user.password;

    createUser(nextAccount);
  }

  async function createUser(user = new Account()) {
    try {
      await UsersActions.createPreUser(user);
      handleOpenSnackBar("success", "Usuário autorizado para primeiro acesso!", 4000);
      onClose();
    } catch (e) {
      console.log(e);
      handleOpenSnackBar("error", e, 4000);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{"Novo Usuário"}</DialogTitle>
      <Divider />
      <DialogContent style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontWeight: 500 }}>Autorizar primeiro acesso ao usuário</span>
        <Container>
          <TextField
            label="Nome"
            value={user.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={hasError("name") && hasInteracted("name")}
            helperText={error["name"]}
          />
          <TextField
            label="E-mail"
            error={hasError("email") && hasInteracted("email")}
            helperText={error["email"]}
            value={user.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Container>
      </DialogContent>

      <DialogActions>
        <Button startIcon={<Close />} onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={hasAnyError || [user.name, user.email].includes("")} startIcon={<Save />} onClick={onConfirm}>Salvar</Button>
      </DialogActions>
    </Dialog>
  )
}
