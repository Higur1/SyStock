import React, { useContext } from 'react'
import { Container, TableContainer, TableData, TableRow } from './styles'
import { Button, TextField } from '@mui/material'
import { Person } from '@mui/icons-material'
import { SettingsContext } from './SettingsPage'
import EditUser, { TYPE_USER_DIALOG } from './dialogs/EditUser'

const columns = [
  { fixedWidth: true, label: "Nome", value: "name", width: 120 },
  { fixedWidth: true, label: "E-mail", value: "email", width: 200 },
  { fixedWidth: true, label: "Telefone", value: "phone", width: 150 },
  { fixedWidth: true, label: "Funções", value: "functions", width: 150 },
];

export default function Settings() {

  const { users } = useContext(SettingsContext);
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: "1.5rem" }}>
        {"Usuários"}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button size="small" variant='contained' startIcon={<Person />}>Meu Usuário</Button>
          <Button size="small" variant='contained'>Novo Usuário</Button>
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
                    width: column.width,
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
                          width: column.width,
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
      {/* <EditUser type={TYPE_USER_DIALOG.EDIT}/> */}
    </Container>
  )
}
