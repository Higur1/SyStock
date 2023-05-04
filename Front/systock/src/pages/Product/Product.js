import React from "react";

export default function Product() {

  const {} = useProduct();
  
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

