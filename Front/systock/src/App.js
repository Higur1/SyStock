import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';
import Login from './pages/Login/Login.js';

function App() {

  const isLoggedIn = false;
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
