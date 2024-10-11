import React, { useState } from 'react'
import { Container, HeaderContainer, Menu, MenuOption, TableContainer, TableData, TableRow } from './Users.styles';
import { Button, IconButton } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomizedSnackbars from '../../components/CustomizedSnackBar';
import useUsers from '../../hooks/useUsers';

const Users = () => {

  const {
    users, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar
  } = useUsers;

  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [menuOption, setMenuOptions] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);

  const handleMenuOptions = (id) => {
    setIdMenu(id);
    setMenuOptions(true);
  }

  return (
    <>
      <Container>
        <HeaderContainer>
          <Button
            variant="contained"
            style={{ minWidth: '236px' }}
            onClick={() => setOpenCreateUser(true)}
          >
            Adicionar Usuário</Button>
        </HeaderContainer>
        <TableContainer>
          <TableRow style={{background: '#DCDCDC', borderRadius: '8px 8px 0px 0px'}}>
            <TableData size={"65%"}> {"Nome"}</TableData>
            <TableData size={"30%"}>{"Tipo de Usuário"}</TableData>
          </TableRow>
          {users.map((user, index) => (
            <TableRow key={user.id} style={{
              borderRadius: index === users.length - 1 ? '0px 0px 8px 8px' : '0px',
              borderBottom: index === users.length - 1 ? '0px' : '1px solid #d3D3D3',
              background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
              }}>
              <TableData size={'65%'} >{user.name}</TableData>
              <TableData size={'30%'} >{user.category}</TableData>
              <TableData size={'5%'} style={{justifyContent: 'flex-end', flex: 1}}>
              <IconButton onClick={() => handleMenuOptions(user.id)} style={{position: 'relative'}}>
                <MoreVertIcon fontSize='small' />
                {menuOption && idMenu === user.id && (
                  <Menu>
                    <MenuOption style={{borderRadius: '16px 16px 0px 0px'}}>{"Visualizar Usuário"}</MenuOption>
                    <MenuOption onClick={() => setEditUser(true)}>{"Editar Usuário"}</MenuOption>
                    <MenuOption style={{borderBottom: '0px', borderRadius: '0px 0px 16px 16px'}} onClick={() => setDeleteUser(true)}>{"Apagar Usuário"}</MenuOption>
                  </Menu>
                )}
              </IconButton>                
              </TableData>
            </TableRow> 
          ))}
        </TableContainer>
      </Container>
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

export default Users