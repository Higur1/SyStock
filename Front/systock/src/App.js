import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginContext = createContext();

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    verifyToken();
  }, []);
  
  const verifyToken = () => {
    const payload = window.localStorage.getItem('tokenLogin');

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
        navigate('products');
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

  const logOff = () => {
    window.localStorage.removeItem('tokenLogin');
    setIsLoggedIn(false);
    window.location.pathname = 'login';
  }



  return (
    <LoginContext.Provider value={{
      isLoggedIn, navigate, setIsLoggedIn,
      actions: {
        setIsLoggedIn,
        logOff
      }
    }}>
      <div className='main' style={{display: !isLoggedIn ? 'flex' : 'grid'}}>
        {isLoggedIn && <Sidebar logOff={logOff}/>}
        <Master />
      </div>
    </LoginContext.Provider>
    
  );
}

export default App;
