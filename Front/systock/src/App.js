import Master from './Master.js';
import './App.css';
import Sidebar from './pages/Sidebar/Sidebar.js';

function App() {
  return (
    <div className='main'>
      <Sidebar />
      <Master />
    </div>
  );
}

export default App;
