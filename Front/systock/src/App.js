import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';
import Login from './pages/Login/Login.js';
import { AppBar } from '@mui/material';

function App() {

  // const isLoggedIn = window.localStorage.getItem('tokenLogin');
  const isLoggedIn = true;


  return (
    isLoggedIn ? (
      <div className='main'>
        <Sidebar />
        <Master />
      </div>
    ) : (
      <Login />
    )
  );
}

export default App;
