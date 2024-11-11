import { Close, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import styled from 'styled-components';
import Account from '../../../classes/Account';
import UsersActions from '../../../Service/Users/UsersActions';
import { MainContext } from '../../../App';

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

export const BoxContainer = styled("div")({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  width: "100%",
  height: 120
});

const PAGETYPE = {
  MAIN: "MAIN",
  EMAIL: "EMAIL",
  PASSWORD: "PASSWORD"
};

export default function MyUser({ type, user, handleConfirm, onClose }) {
  const { handleOpenSnackBar } = useContext(MainContext);
  const [page, setPage] = useState(PAGETYPE.MAIN);
  const [content, setContent] = useState({content: "", confirmContent: ""});
  const [error, setError] = useState(false);
  const isEditUser = true;

  async function saveEmail() {
    if(content.content !== content.confirmContent) return setError(true);
    const nextUser = new Account({id: user.id, email: content.content});
    try {
      await UsersActions.updatePatch(nextUser);

      handleConfirm(nextUser);
    } catch (e) {
      console.log(e);
      handleOpenSnackBar("error", e, 3000);
    }
  }

  async function savePassword() {
    if(content.content !== content.confirmContent) return setError(true);
    const nextUser = new Account({ id: user.id, password: content.content});
    try {
      await UsersActions.updatePatch(nextUser);

      handleConfirm(nextUser);
    } catch (e) {
      console.log(e);
      handleOpenSnackBar("error", "An error occurred", 3000);
    }
  }

  function onChange(type, value) {
    setError(false);
    setContent(prevContent => ({...prevContent, [type]: value}));
  }

  function backToMainPageAndResetContent() {
    setPage(PAGETYPE.MAIN);
    setContent({content: "", confirmContent: ""});
  }

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{isEditUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
      <Divider />
      <DialogContent style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 8}}>
        {PAGETYPE.MAIN === page && (
          <Container>
            <TextField variant="standard" disabled label="Nome" style={{ gridArea: "name" }} value={user.name} onChange={(e) => onChange("name", e.target.value)}/>
            <TextField variant="standard" disabled label="Username" style={{ gridArea: "email" }} value={user.user} onChange={(e) => onChange("email", e.target.value)}/>
            <BoxContainer>
              <Button variant='outlined' onClick={() => setPage(PAGETYPE.EMAIL)} style={{flexBasis: 'calc(50% - 16px)', height: '100%'}}>Alterar e-mail</Button>
              <Button variant='outlined' onClick={() => setPage(PAGETYPE.PASSWORD)} style={{flexBasis: 'calc(50% - 16px)', height: '100%'}}>Alterar senha</Button>
            </BoxContainer>
          </Container>
        )}

        {[PAGETYPE.EMAIL, PAGETYPE.PASSWORD].includes(page) && (
          <Container>
            <TextField type={PAGETYPE.PASSWORD === page ? "password" : "email"} variant="standard" label={page === PAGETYPE.EMAIL ? "Novo e-mail" : "Nova senha"} style={{ gridArea: "name" }} value={content.content} onChange={(e) => onChange("content", e.target.value)}/>
            <TextField type={PAGETYPE.PASSWORD === page ? "password" : "email"} variant="standard" label={page === PAGETYPE.EMAIL ? "Confirmar novo e-mail" : "Confirmar nova senha"} style={{ gridArea: "email" }} value={content.confirmContent} onChange={(e) => onChange("confirmContent", e.target.value)}/>
            {error && (<span style={{color: 'red'}}>Verifique se as informações estão equivalentes</span>)}
          </Container>
        )}
        
      </DialogContent>

      {PAGETYPE.MAIN === page && (
        <DialogActions>
          <Button startIcon={<Close />} onClick={onClose}>Fechar</Button>
        </DialogActions>
      )}

      {PAGETYPE.EMAIL === page && (
        <DialogActions>
          <Button startIcon={<Close />} onClick={backToMainPageAndResetContent}>Voltar</Button>
          <Button variant="contained" startIcon={<Save />} onClick={saveEmail}>Salvar</Button>
        </DialogActions>
      )}

      {PAGETYPE.PASSWORD === page && (
        <DialogActions>
          <Button startIcon={<Close />} onClick={backToMainPageAndResetContent}>Voltar</Button>
          <Button variant="contained" startIcon={<Save />} onClick={savePassword}>Salvar</Button>
        </DialogActions>
      )}
      
    </Dialog>
  )
}
