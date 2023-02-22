import { Link } from 'react-router-dom';
import { Option, Container, CustomArrow } from './styles.js';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import Estoque from '../../images/stock.png';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Sidebar() {



  return (
    <Container>
      <CustomArrow />
      <Option>
        <DashboardIcon style={{ width: 30, height: 30 }} />
        <Link to="dashboard">Dashboard</Link>
      </Option>
      <Option>
        <CategoryIcon style={{ width: 30, height: 30 }} />
        <Link to="category">Categoria</Link>
      </Option>
      <Option>
        <InventoryIcon style={{ width: 30, height: 30 }} />
        <Link to="product">Product</Link>
      </Option>
      <Option>
        <img src={Estoque} style={{ width: 32, height: 32 }}/>
        <Link to="stock">Estoque</Link>
      </Option>
      <Option>
        <SettingsIcon style={{ width: 30, height: 30 }} />
        <Link to="settings">Configurações</Link>
      </Option>
    </Container>
  );
}