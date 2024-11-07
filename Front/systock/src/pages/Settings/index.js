import React, { useContext, useEffect, useState } from 'react'
import { Container, TableContainer, TableData, TableRow } from './styles'
import { Button, TextField } from '@mui/material'
import { Person } from '@mui/icons-material'
import { SettingsContext } from './SettingsPage'
import EditUserDialog, { TYPE_USER_DIALOG } from './dialogs/EditUser'
import Account from '../../classes/Account'
import { MainContext } from '../../App'

const columns = [
  { fixedWidth: false, label: "Nome", value: "name", width: 120 },
  { fixedWidth: false, label: "E-mail", value: "email", width: 200 },
  { fixedWidth: true, label: "Telefone", value: "phone", width: 150 },
  { fixedWidth: true, label: "Funções", value: "functions", width: 150 },
];

export default function Settings() {

  const { token } = useContext(MainContext);
  const { users, getUsers, createUser, editUser } = useContext(SettingsContext);

  const [editDialogProps, setEditDialogProps] = useState({ open: false, user: null, type: TYPE_USER_DIALOG.NEW });

  function handleEditUser(user = new Account({})) {
    setEditDialogProps({ open: true, user, type: TYPE_USER_DIALOG.EDIT });
  }

  function handleNewUser() {
    setEditDialogProps({ open: true, user: null, type: TYPE_USER_DIALOG.NEW });
  }

  function handleMyUser() {

    const myUser = users.find(user => user.email === token.email);
    handleEditUser(myUser);
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
                          flex: column.fixedWidth ? "none" : "1"
                        }}
                      >
                        {log[column.value]}
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
        <EditUserDialog
          type={editDialogProps.type}
          user={editDialogProps.user || new Account({})}
          onClose={() => setEditDialogProps({open: false, user: null})}
          handleConfirm={(user) => {
            if(TYPE_USER_DIALOG.NEW === editDialogProps.type) return createUser(user);

            return editUser(user);
          }}
        />
      )}
    </Container>
  )
}
