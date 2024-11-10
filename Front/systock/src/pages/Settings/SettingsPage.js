import React, { createContext, useState } from 'react'
import Settings from '.';
import UsersActions from '../../Service/Users/UsersActions';
import Account from '../../classes/Account';

export const SettingsContext = createContext();

const loadingTypes = {
  USERS: 0,
}

export default function SettingsPage() {
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

  async function createUser(user = new Account()) {
    try {
      const nextUser = await UsersActions.createPreUser(user);
      setUsers(prevUsers => [...prevUsers, nextUser]);
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  }

  function updateUserOnList(user = new Account()) {
    setUsers(prevUsers => prevUsers.map(pUser => pUser.id === user.id ? user : pUser));
  }

  return (
    <SettingsContext.Provider value={{ users, getUsers, loading, createUser, editUser, updateUserOnList, deleteUser }}>
      <Settings />
    </SettingsContext.Provider>
  )
}
