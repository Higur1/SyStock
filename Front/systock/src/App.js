import React, { useRef } from 'react';
import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB_DEBUG_NAME, getDBBase, setInitialData, verifyHasContent } from './utils/debug-local-helper.js';
import CustomizedSnackbars from './components/CustomizedSnackBar.js';
import { FILTER_TYPES } from './pages/Product/tabs/productList.js';

export const MainContext = createContext();
export const DEBUG_LOCAL = false;
const initialStateSnack = {open: false, autoHide: 3000, severity: "info", message: ""}

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [dbBase, setDbBase] = useState(null);
  const [snackbar, setSnackbar] = useState(initialStateSnack);

  const tokenRef = useRef();

  function handleOpenSnackBar(severity, message="Unexpected Error Occurred", autoHide=3000) {
    setSnackbar({open: true, severity, message, autoHide});
  }

  function handleCloseSnackBar() {
    setSnackbar(initialStateSnack);
  }

  function redirectToListProductsFiltered(filter = FILTER_TYPES.ALL) {
    navigate(`/products?filter=${filter}`);
  }


  useEffect(() => {
    if(DEBUG_LOCAL) {
      if(!verifyHasContent()) setInitialData();
      
      // getDB();
    }
    verifyToken();
  }, []);
  
  const verifyToken = () => {
    const payload = window.localStorage.getItem('tokenLogin');
    if(DEBUG_LOCAL) {
      if(payload === "connectLocal") {
        setIsLoggedIn(true);
        // getDB();
        return initialNavigation();
      } else {
        setIsLoggedIn(false);
        if(window.location.pathname.indexOf("/reset/password/") !== -1) return;
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
        tokenRef.current = token;
        // getDB();
        initialNavigation();
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

  function initialNavigation() {
    if(window.location.pathname === '/') return navigate("/home");
    navigate(window.location.pathname);
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
      handleOpenSnackBar,
      dbBase,
      updateData,
      getData,redirectToListProductsFiltered,
      token: tokenRef.current
    }}>
      <div className='main' style={{display: !isLoggedIn ? 'flex' : 'grid'}}>
        {isLoggedIn && <Sidebar logOff={logOff}/>}
        <Master />
      </div>
      {snackbar.open && (
        <CustomizedSnackbars 
          open
          autoHide={snackbar.autoHide}
          handleClose={handleCloseSnackBar}
          severity={snackbar.severity}
          snackMessage={snackbar.message}
        />
      )}
    </MainContext.Provider>
  );
}

export default App;
