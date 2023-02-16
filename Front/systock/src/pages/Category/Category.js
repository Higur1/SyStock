import { Autocomplete, Button, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'
import useCategory from '../../hooks/useCategory';
import { Container, HeaderContainer } from './styles'

export default function Category() {
  const { categories, categorySelected, handleChange } = useCategory();
  return (
    <Container>
      <HeaderContainer>
      <Select
          id="demo-simple-select"
          value={categorySelected}
          defaultValue={categorySelected}
          label="Categoria"
          onChange={(e) => handleChange(e)}
        >
          {categories.map((category, index) => (
            <MenuItem value={category} key={index}>{category}</MenuItem>
          ))}
        </Select>
        <Button variant="contained">Nova Categoria</Button>
      </HeaderContainer>
    </Container>
  )
}
