import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material";
import React, { useState } from "react";
import PropTypes from 'prop-types';
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

export default function EditCategoryDialog(props) {
  const { open, handleClose, category, handleSave } = props;

  const [categoryLabel, setCategoryLabel] = useState(category.name);
  const [hasError, setHasError] = useState(false);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle><Title>{"Editar Categoria"}</Title></DialogTitle>
      <DialogContent>
        <Container>
          <TextField
            required
            label="Nome da categoria"
            value={categoryLabel}
            onChange={(e) => setCategoryLabel(e.target.value)}
            error={hasError}
          />
          <div style={{color: 'red', display: hasError ? 'block' : 'none'}}>Preencha os campos obrigatórios!</div>
        </Container>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => {
          if(categoryLabel === '') {
            setHasError(true);
            return;
          }
          handleSave({id: category.id, name: categoryLabel});
          handleClose();
          }}>Salvar</Button>
      </DialogActions>

    </Dialog>
  );
}

EditCategoryDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  handleSave: PropTypes.func
};