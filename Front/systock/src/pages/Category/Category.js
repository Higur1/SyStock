import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem, TextField } from '@mui/material'
import React from 'react'
import { Container, HeaderContainer, TableContainer, TableData, TableRow } from './styles'
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
    insertCategory,

    openCreateCategory, setOpenCreateCategory,
    editCategory, setEditCategory,
    deleteCategory, setDeleteCategory,
    handleMenu, menu, setMenu
  } = useCategory();

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
                      <IconButton onClick={(e) => handleMenu(e, cat)} style={{ position: 'relative' }}>
                        <MoreVertIcon fontSize='small' />
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
          category={categoriesFiltered.find(cat => cat.id === menu.category.id)}
          onClose={() => {
            setEditCategory(false);
            setMenu({anchor: null, category: null});
          }}
          insertCategory={insertCategory}
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
              handleDeleteCategory(menu.category);
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

      {menu.anchor !== null && (
        <Menu
          id="simple-menu"
          anchorEl={menu.anchor}
          keepMounted
          open
          onClose={() => setMenu({anchor: null, category: null})}
        >
          <MenuItem onClick={() => setEditCategory(true)}>Editar Categoria</MenuItem>
          <MenuItem onClick={() => setDeleteCategory(true)}>Excluir Categoria</MenuItem>
        </Menu>
      )}
    </>
  )
}
