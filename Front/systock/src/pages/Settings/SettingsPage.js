import React, { createContext, useState } from 'react'
import Settings from '.';
import UsersActions from '../../Service/Users/UsersActions';

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

  return (
    <SettingsContext.Provider value={{ users, getUsers, loading }}>
      <Settings />
    </SettingsContext.Provider>
  )
}
