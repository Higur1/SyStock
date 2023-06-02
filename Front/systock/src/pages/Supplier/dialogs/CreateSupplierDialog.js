import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";

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

const CurrencyInputCustom = () => {
  return (
    <CurrencyInput
    />
  );
};

export default function CreateSupplierDialog(props) {
  const { handleCreate, handleClose, error, open } = props;


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMount = useRef();

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Adicionar Fornecedor"}</Title></DialogTitle>
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
              {/* {error !== null && <>{error.message}</>} */}
            </div>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => {
            // if(ncmsh === '' || description === '' ||
            //   price === 0 || categoryID === '') {
            //   setHasError(true);
            //   return;
            // }

            setIsLoading(true);
            const supplier = {
              name, email, phone
            };

            handleCreate(supplier);
            }}>Adicionar</Button>
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

CreateSupplierDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleCreate: PropTypes.func,
  error: PropTypes.object
};