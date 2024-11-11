import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import CategoryActions from "../../../Service/Category/CategoryActions";
import { MainContext } from "../../../App";
import Category from "../../../classes/Category";

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
  const { handleOpenSnackBar } = useContext(MainContext);
  const { open, handleClose, category } = props;

  const [categoryLabel, setCategoryLabel] = useState(category.name);

  async function onSave() {
    const newCategory = new Category({...category, name: categoryLabel});
    try {
      const newItem = await CategoryActions.update(newCategory);
      props.insertCategory(newItem);
      
      handleOpenSnackBar("success", "Categoria atualizada com sucesso!!", 3500);
      props.onClose();
    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    }
  }

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
          />
        </Container>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button disabled={categoryLabel === ""} onClick={onSave}>Salvar</Button>
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