import { Autocomplete, Button,  Chip,  TextField } from '@mui/material'
import React from 'react'
import VirtualizedTable from '../../components/VirtualizedTable';
import useCategory from '../../hooks/useCategory';
import { Container, HeaderContainer } from './styles'

export default function Category() {
  const { categories,  handleSelectedOptions, selectedCategories, categoriesFiltered } = useCategory();
  return (
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
          sx={{ width: 500, margin: 0 }}
          renderInput={(params) => <TextField {...params} label="Categoria" />}
        />
        <Button variant="contained">Nova Categoria</Button>
      </HeaderContainer>
      <VirtualizedTable options={categoriesFiltered}/>
    </Container>
  )
}
