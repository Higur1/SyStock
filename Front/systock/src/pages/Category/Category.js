import { Autocomplete, Button, Chip, Icon, IconButton, TextField } from '@mui/material'
import React, { useState } from 'react'
import CreateCategoryDialog from '../../components/dialogs/CreateCategoryDialog';
import { Container, HeaderContainer, Menu, MenuOption, TableContainer, TableData, TableRow } from './styles'
import useCategory from '../../hooks/useCategory';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditCategoryDialog from '../../components/dialogs/EditCategoryDialog';

export default function Category() {

  const {
    categories,
    selectedCategories,
    setSelectedCategories,
    categoriesFiltered,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory
  } = useCategory();

  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [menuOption, setMenuOptions] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);

  function handleMenuOptions(id) {
    setMenuOptions(!menuOption);
    setIdMenu(id);
  }
  
  if(categories.length === 0) return;

  return (
    <>
      <Container>
        <HeaderContainer>
          <Autocomplete
            multiple
            id="combo-box-category"
            options={categories.map(cat => cat.name)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            value={selectedCategories}
            onChange={(event, newValue) => setSelectedCategories(newValue)}
            sx={{ width: '100%', margin: 0 }}
            renderInput={(params) => <TextField {...params} label="Categoria" />}
          />
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setOpenCreateCategory(true)}
          >
            Adicionar Categoria</Button>
        </HeaderContainer>
        <TableContainer>
          <TableRow style={{background: '#DCDCDC', borderRadius: '8px 8px 0px 0px'}}>
            <TableData>{"Nome"}
          </TableData>
          </TableRow>
          {categoriesFiltered.map((cat, index) => (
            <TableRow key={cat.id} style={{
              borderRadius: index === categoriesFiltered.length - 1 ? '0px 0px 8px 8px' : '0px',
              borderBottom: index === categoriesFiltered.length - 1 ? '0px' : '1px solid #d3D3D3',
              background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
              }}>
              <TableData size={'400px'} >{cat.name}</TableData>
              <TableData size={'56px'} style={{justifyContent: 'flex-end', flex: 1}}>
              <IconButton onClick={() => handleMenuOptions(cat.id)} style={{position: 'relative'}}>
                <MoreVertIcon fontSize='small' />
                {menuOption && idMenu === cat.id && (
                  <Menu>
                    <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Categoria"}</MenuOption>
                    <MenuOption onClick={() => setEditCategory(true)}>{"Editar Categoria"}</MenuOption>
                    <MenuOption style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} onClick={() => setDeleteCategory(true)}>{"Apagar Categoria"}</MenuOption>
                  </Menu>
                )}
              </IconButton>                
              </TableData>
            </TableRow> 
          ))}
        </TableContainer>
      </Container>
      {openCreateCategory && (
        <CreateCategoryDialog 
          open={openCreateCategory}
          handleClose={() => setOpenCreateCategory(false)}
          categories={categories}
          createCategory={handleCreateCategory}
        />
      )}
      {editCategory && (
        <EditCategoryDialog
          open={editCategory}
          category={categoriesFiltered.find(cat => cat.id === idMenu)}
          handleClose={() => setEditCategory(false)}
          handleSave={handleUpdateCategory}
        />
      )}
      {deleteCategory && (
        <Dialog
        open={deleteCategory}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Deseja  mesmo apagar essa categoria?"}</Title></DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteCategory(false)}>Cancelar</Button>
          <Button onClick={() => {
            handleDeleteCategory(idMenu);
            setDeleteCategory(false);
          }}>Confirmar</Button>
        </DialogActions>
      </Dialog>
      )}
    </>
  )
}
