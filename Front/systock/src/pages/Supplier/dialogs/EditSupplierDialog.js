import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import { performFetch } from "../../../apiBase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding-top: 16px;
`

export default function EditSupplierDialog(props) {
  const { handleEdit, handleClose, error, open, supplier } = props;

  const { id } = supplier;
  
  const [name, setName] = useState(supplier.name || "");
  const [phone, setPhone] = useState(supplier.phone || "");
  const [email, setEmail] = useState(supplier.email || "");
  const [hasError, setHasError] = useState(false);
  const [hasErrorPrice, setHasErrorPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Editar Fornecedor"}</Title></DialogTitle>
        <DialogContent>
          <Container>
          
            <TextField
              required
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0,255))}
              disabled={isLoading}
            />
            <TextField
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0,255))}
              disabled={isLoading}
            />
            <TextField
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0,15))}
              disabled={isLoading}
            />
            <div style={{color: 'red', display:'flex', flexDirection: 'column'}}>
              {hasError && <>{"Preencha os campos obrigatórios!"}</>}
            </div>
          </Container>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => {
            
            setIsLoading(true);

            const supplier = {
              id, name, email, phone
            };

            handleEdit(supplier);
            }}>Editar</Button>
        </DialogActions>

      </Dialog>

      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
      >
      <CircularProgress color="inherit" />
      </Backdrop>
    
    </>
  );
}

EditSupplierDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleEdit: PropTypes.func,
  error: PropTypes.object,
  supplier: PropTypes.object
};