import React, { useState } from "react";
import useProduct from "../../hooks/useProduct"
import { Container, HeaderContainer, MenuOption, TableContainer, TableData, TableRow, Menu } from "./styles";
import { Button, ClickAwayListener, IconButton } from "@mui/material";
import ToolTipAndEllipsis from "../../components/dialogs/ComponentUtils/ToolTipAndEllipsis";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Product() {

  const { products } = useProduct();
  const [menuOption, setMenuOption] = useState(false);
  const [idMenu, setIdMenu] = useState(null);

  function handleMenuOptions(id) {
    setMenuOption(true);
    setIdMenu(id);
  }

  function handleCloseMenu() {
    setMenuOption(false);
    setIdMenu(null);
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          {/* <Autocomplete
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
          /> */}
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            // onClick={() => setOpenCreateProduct(true)}
          >
            Adicionar Produto
          </Button>
        </HeaderContainer>
        <TableContainer>
          <TableRow style={{background: '#DCDCDC', borderRadius: '8px 8px 0px 0px'}}>
            <TableData width={"32%"} minWidth={'200px'}>{"Nome"}</TableData>
            <TableData width={"50%"} minWidth={'300px'}>{"Descrição"}</TableData>
            <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"ncmSh"}</TableData>
            <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Preço"}</TableData>
            <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Categoria"}</TableData>
            <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{"Supplier"}</TableData>
            <TableData width={"40px"} style={{justifyContent: 'center'}}minWidth={'40px'} />
          </TableRow>
          {products.map((prod, index) => (
            <TableRow key={index} style={{
              borderRadius: index === products.length - 1 ? '0px 0px 8px 8px' : '0px',
              borderBottom: index === products.length - 1 ? '0px' : '1px solid #d3D3D3',
              background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
            }}>
              <TableData width={"32%"} minWidth={'200px'}>{prod.name}</TableData>
              <TableData width={"50%"} minWidth={'300px'}>
                <ToolTipAndEllipsis item={prod.description} />
              </TableData>
              <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.ncmSh}</TableData>
              <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.price}</TableData>
              <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.category_id}</TableData>
              <TableData width={"7%"} style={{justifyContent: 'center'}}minWidth={'60px'}>{prod.supplier_id}</TableData>
              <TableData width={"40px"} style={{justifyContent: 'center'}}minWidth={'40px'}>
                <IconButton onClick={() => handleMenuOptions(index)}>
                  <MoreVertIcon fontSize='small'/>
                  {menuOption && idMenu === index && (
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                      <Menu>
                        <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Produto"}</MenuOption>
                        <MenuOption>{"Editar Produto"}</MenuOption>
                        <MenuOption style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} >{"Apagar Produto"}</MenuOption>
                      </Menu>
                    </ClickAwayListener>
                  
                )}
                </IconButton>
                </TableData>
            </TableRow> 
          ))}
        </TableContainer>
      </Container>

      
    </>
  )
}

