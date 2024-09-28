import React, { createContext, useState } from 'react'
import Settings from '.';

export const SettingsContext = createContext();

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  return (
    <SettingsContext.Provider value={{ users }}>
      <Settings />
    </SettingsContext.Provider>
  )
}
