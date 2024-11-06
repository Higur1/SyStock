import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogTitle, IconButton, TextField } from '@mui/material'
import React from 'react'
import { Container, HeaderContainer, Menu, MenuOption, TableContainer, TableData, TableRow } from './styles'
import useCategory from '../../hooks/useCategory';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateCategoryDialog from './dialogs/CreateCategoryDialog';
import EditCategoryDialog from './dialogs/EditCategoryDialog';
import CustomizedSnackbars from '../../components/CustomizedSnackBar';
import NoData from '../../components/common/NoData';

export default function Category() {

  const {
    categories,
    selectedCategories,
    setSelectedCategories,
    categoriesFiltered,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    openSnackBar,
    autoHideSnackBar,
    severitySnackBar,
    snackMessageSnackBar,
    handleCloseSnackBar,

    openCreateCategory, setOpenCreateCategory,
    menuOption,
    idMenu,
    editCategory, setEditCategory,
    deleteCategory, setDeleteCategory,
    handleMenuOptions
  } = useCategory();

  console.log(categories)
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
                  key={index}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            value={selectedCategories}
            onChange={(_, newValue) => setSelectedCategories(newValue)}
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
          <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
            <TableData>{"Nome"}</TableData>
          </TableRow>
          <div className="customScroll">
            {categoriesFiltered.length > 0 ? (
              <>
                {categoriesFiltered.map((cat, index) => (
                  <TableRow key={cat.id} style={{
                    borderRadius: index === categoriesFiltered.length - 1 ? '0px 0px 8px 8px' : '0px',
                    borderBottom: index === categoriesFiltered.length - 1 ? '0px' : '1px solid #d3D3D3',
                    background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                  }}>
                    <TableData size={'400px'} >{cat.name}</TableData>
                    <TableData size={'56px'} style={{ justifyContent: 'flex-end', flex: 1 }}>
                      <IconButton onClick={() => handleMenuOptions(cat.id)} style={{ position: 'relative' }}>
                        <MoreVertIcon fontSize='small' />
                        {menuOption && idMenu === cat.id && (
                          <Menu>
                            <MenuOption onClick={() => setEditCategory(true)}>{"Editar Categoria"}</MenuOption>
                            <MenuOption style={{ borderBottom: '0px', borderRadius: '0px 0px 16px 16px' }} onClick={() => setDeleteCategory(true)}>{"Apagar Categoria"}</MenuOption>
                          </Menu>
                        )}
                      </IconButton>
                    </TableData>
                  </TableRow>
                ))}
              </>
            ) : (
              <NoData />
            )}
          </div>

        </TableContainer>
      </Container>
      {openCreateCategory && (
        <CreateCategoryDialog
          open={openCreateCategory}
          handleCloseSnackBar={handleCloseSnackBar}
          handleClose={() => setOpenCreateCategory(false)}
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
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{"Deseja  mesmo apagar essa categoria?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteCategory(false)}>Cancelar</Button>
            <Button onClick={() => {
              handleDeleteCategory({ id: idMenu });
              setDeleteCategory(false);
            }}>Confirmar</Button>
          </DialogActions>
        </Dialog>
      )}
      {openSnackBar && (
        <CustomizedSnackbars
          open={openSnackBar}
          autoHide={autoHideSnackBar}
          handleClose={handleCloseSnackBar}
          severity={severitySnackBar}
          snackMessage={snackMessageSnackBar}
        />
      )}
    </>
  )
}
