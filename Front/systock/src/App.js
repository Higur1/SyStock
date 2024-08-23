import React from 'react';
import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB_DEBUG_NAME, getDBBase, setInitialData, verifyHasContent } from './utils/debug-local-helper.js';

export const MainContext = createContext();
export const DEBUG_LOCAL = true;

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [dbBase, setDbBase] = useState(null);

  useEffect(() => {
    if(DEBUG_LOCAL) {
      if(!verifyHasContent()) setInitialData();
    }
    verifyToken();
  }, []);
  
  const verifyToken = () => {
    const payload = window.localStorage.getItem('tokenLogin');
    if(DEBUG_LOCAL) {
      if(payload === "connectLocal") {
        setIsLoggedIn(true);
        getDB();
        return navigate(window.location.pathname);
      } else {
        setIsLoggedIn(false);
        return navigate('login');
      }
    }

    if(payload) {
      let base64Url = payload.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    
      const token = JSON.parse(jsonPayload);

      if(token.exp < Date.now() / 1000) {
        window.localStorage.removeItem('tokenLogin');
        setIsLoggedIn(false);
        navigate('login');
        return;
      } else {
        setIsLoggedIn(true);
        getDB();
        navigate(window.location.pathname);
      }
    } else {
      window.localStorage.removeItem('tokenLogin');
      setIsLoggedIn(false);

      if(window.location.pathname.indexOf('reset/password') !== -1) return;
      navigate('login');
      return;
      // return window.location.pathname = 'login';
    }
  }

  function getDB() {
    const db =  getDBBase();
    setDbBase(db);
  }

  function updateData(type, value) {
    if(!verifyHasContent()) return;
  
    const nextDB = {...dbBase, [type]: value};
    setDbBase(nextDB);
  
    window.localStorage.setItem(DB_DEBUG_NAME, JSON.stringify(nextDB));
  }

  function getData(type) {
    if(!verifyHasContent()) return;

    return dbBase[type];
  }

  const logOff = () => {
    window.localStorage.removeItem('tokenLogin');
    setIsLoggedIn(false);
    window.location.pathname = 'login';
  }



  return (
    <MainContext.Provider value={{
      isLoggedIn, navigate, setIsLoggedIn,
      actions: {
        setIsLoggedIn,
        logOff,
      },
      dbBase,
      updateData,
      getData
    }}>
      <div className='main' style={{display: !isLoggedIn ? 'flex' : 'grid'}}>
        {isLoggedIn && <Sidebar logOff={logOff}/>}
        <Master />
      </div>
    </MainContext.Provider>
    
  );
}

export default App;
