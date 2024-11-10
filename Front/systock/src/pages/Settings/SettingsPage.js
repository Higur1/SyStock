import React, { createContext, useContext, useState } from 'react'
import Settings from '.';
import UsersActions from '../../Service/Users/UsersActions';
import Account from '../../classes/Account';
import { MainContext } from '../../App';

export const SettingsContext = createContext();

const loadingTypes = {
  USERS: 0,
}

export default function SettingsPage() {
  const { handleOpenSnackBar } = useContext(MainContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState([]);

  async function getUsers() {
    setLoading(prevList => [...prevList, loadingTypes.USERS]);

    try {
      const result = await UsersActions.getAll();
      setUsers(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prevList => prevList.filter(loading => loading !== loadingTypes.USERS));
    }
  }

  async function editUser(user = new Account()) {
    try {
      const nextUser = await UsersActions.update(user);
      setUsers(prevUsers => prevUsers.map(pUser => pUser.id === nextUser.id ? nextUser : pUser));
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteUser(user = new Account()) {
    try {
      await UsersActions.delete(user.id);
      setUsers(prevUsers => prevUsers.filter(pUser => pUser.id !== user.id));

      handleOpenSnackBar("success", "Usuário deletado", 3000);
    } catch (e) {
      console.error(e);
      handleOpenSnackBar("error", "Ocorreu um erro ao apagar esse usuário", 3000);
    }
  }

  function updateUserOnList(user = new Account()) {
    setUsers(prevUsers => prevUsers.map(pUser => pUser.id === user.id ? user : pUser));
  }

  return (
    <SettingsContext.Provider value={{ users, getUsers, loading, editUser, updateUserOnList, deleteUser }}>
      <Settings />
    </SettingsContext.Provider>
  )
}
