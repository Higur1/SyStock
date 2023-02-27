import { Autocomplete, Button, Chip, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useContext } from 'react';
import CreateCategoryDialog from '../../components/dialogs/CreateCategoryDialog';
import VirtualizedTable from '../../components/VirtualizedTable';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Container, HeaderContainer } from './styles'



export default function Category() {

  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const { 
    categories,
    handleSelectedOptions,
    selectedCategories,
    categoriesFiltered,
    handleCreateCategory
  } = useContext(CategoryContext);
  
  return (
    <>
      <Container>
        <HeaderContainer>
          <Autocomplete
            multiple
            id="combo-box-category"
            options={categories.map(cat => cat.label)}
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
            onChange={(event, newValue) => handleSelectedOptions(newValue)}
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
        <VirtualizedTable options={categoriesFiltered} />
      </Container>
      {openCreateCategory && (
        <CreateCategoryDialog 
          open={openCreateCategory}
          handleClose={() => setOpenCreateCategory(false)}
          categories={categories}
          createCategory={handleCreateCategory}
        />
      )}
    </>
  )
}