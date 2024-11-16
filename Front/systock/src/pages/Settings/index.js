import React, { useContext, useEffect, useState } from 'react'
import { Container, TableContainer, TableData, TableRow } from './styles'
import { Button, IconButton, Menu, MenuItem, Popper, TextField } from '@mui/material'
import { MoreVert, Person } from '@mui/icons-material'
import { SettingsContext } from './SettingsPage'
import NewUserDialog, { TYPE_USER_DIALOG } from './dialogs/NewUser'
import Account from '../../classes/Account'
import { MainContext } from '../../App'
import MyUser from './dialogs/MyUser'
import TableRenderUI from '../../utils/TableRenderUI'
import TooltipAndEllipsis from '../../components/dialogs/ComponentUtils/ToolTipAndEllipsis'

const columns = [
  { fixedWidth: false, label: "Nome", value: "name", width: 120 },
  { fixedWidth: false, label: "E-mail", value: "email", width: 200 },
  { fixedWidth: true, label: "", value: "functions", width: 50 },
];

export default function Settings() {

  const { token, handleOpenSnackBar } = useContext(MainContext);
  const { users, getUsers, editUser, updateUserOnList, deleteUser} = useContext(SettingsContext);

  const [editDialogProps, setEditDialogProps] = useState({ open: false, user: null, type: TYPE_USER_DIALOG.NEW });
  const [dialogMyUser, setDialogMyUser] = useState({open: false, user: null});
  const [menu, setMenu] = useState({anchor: null, user: null});

  function handleMenu(e, user) {
    const anchor = e.currentTarget;
    setMenu({anchor, user});
  }
  function handleEditUser(user = new Account({})) {
    setMenu({anchor: null, user: null});
    setDialogMyUser({ open: true, user });
  }

  function handleNewUser() {
    setEditDialogProps({ open: true, user: null, type: TYPE_USER_DIALOG.NEW });
  }

  async function handleDeleteUser(user) {
    try {
      await deleteUser(user);

      handleOpenSnackBar("success", "Usuário deletado", 3000);
    } catch (e) {
      handleOpenSnackBar("error", e);
    } finally {
      setMenu({anchor: null, user: null});
    }
  }

  function handleMyUser() {

    const myUser = users.find(user => user.id === token.id);
    setDialogMyUser({open: true, user: myUser});
  }

  function updateMyUser(user) {
    updateUserOnList(user);
    setDialogMyUser({open: false, user: null});
    handleOpenSnackBar("success", "Usuário atualizado", 3000);
  }  

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: "1.5rem" }}>
        {"Usuários"}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button size="small" onClick={handleMyUser} variant='contained' startIcon={<Person />}>Meu Usuário</Button>
          <Button size="small" onClick={handleNewUser} variant='contained'>Novo Usuário</Button>
        </div>

      </div>
      <TextField placeholder='Digite o nome do usuário' />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <TableRow>
              {columns.map((column, i) => (
                <TableData
                  key={`header-${i}`}
                  style={{
                    justifyContent: column.fixedWidth ? "center" : "left",
                    width: column.fixedWidth ? column.width : "100%",
                    maxWidth: column.fixedWidth ? column.width : "auto",
                    flex: column.fixedWidth ? "none" : "1"
                  }}
                >
                  {column.label}
                </TableData>
              ))}
            </TableRow>
            <div className="customScroll">
              {users.map((log, index) => (
                <TableRow key={index}>
                  {columns.map((column, i) => {
                    return (
                      <TableData
                        key={`row-${index}-${i}`}
                        style={{
                          justifyContent: column.fixedWidth ? "center" : "left",
                          width: column.fixedWidth ? column.width : "100%",
                          maxWidth: column.fixedWidth ? column.width : "auto",
                          flex: column.fixedWidth ? "none" : "1",
                          overflow: 'hidden'
                        }}
                      >
                        <>
                          {column.value !== "functions" ? (<><TooltipAndEllipsis item={TableRenderUI(column.value, log[column.value])} /></>) : (
                            <IconButton onClick={e => handleMenu(e, log)}>
                              <MoreVert />
                            </IconButton>
                          )}
                        </>
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          </TableContainer>
        </div>
      </div>
      {editDialogProps.open && (
        <NewUserDialog
          type={editDialogProps.type}
          user={editDialogProps.user || new Account({})}
          onClose={() => setEditDialogProps({open: false, user: null})}
        />
      )}
      {dialogMyUser.open && <MyUser user={dialogMyUser.user} handleConfirm={updateMyUser} onClose={() => setDialogMyUser({open: false, user: null})}/>}

      {menu.anchor !== null && (
        <Menu
          id="simple-menu"
          anchorEl={menu.anchor}
          keepMounted
          open
          onClose={() => setMenu({anchor: null, user: null})}
        >
          <MenuItem onClick={() => handleEditUser(menu.user)}>Editar Usuário</MenuItem>
          <MenuItem onClick={() => handleDeleteUser(menu.user)}>Excluir Usuário</MenuItem>
        </Menu>
      )}
    </Container>
  )
}
