import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

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

export default function CreateCategoryDialog(props) {
  const { open, handleClose, categories, createCategory } = props;

  const [categoryLabel, setCategoryLabel] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  const [hasError, setHasError] = useState(false);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle><Title>{"Adicionar Categoria"}</Title></DialogTitle>
      <DialogContent>
        <Container>
          <TextField
            required
            label="Nome da categoria"
            value={categoryLabel}
            onChange={(e) => setCategoryLabel(e.target.value)}
            error={hasError}
          />
          <FormControl>
            <InputLabel id="test-select-label">Categoria Pai</InputLabel>
            <Select
              value={categoryParent}
              onChange={(e) => setCategoryParent(e.target.value)}
              labelId="test-select-label"
              label="Categoria Pai"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat, index) => (
                <MenuItem value={cat.label} key={index}>{cat.label}</MenuItem>
              )
              )}
            </Select>
          </FormControl>
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
          createCategory({name: categoryLabel});
          handleClose();
          }}>Adicionar</Button>
      </DialogActions>

    </Dialog>
  );
}

CreateCategoryDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  categories: PropTypes.array,
  createCategory: PropTypes.func
}