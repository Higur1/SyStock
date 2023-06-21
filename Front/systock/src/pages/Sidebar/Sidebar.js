import { Link } from 'react-router-dom';
import { Option, Container, CustomArrow } from './styles.js';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import Estoque from '../../images/stock.png';
import Fornecedor from '../../images/parcela.png';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';

export default function Sidebar() {

  const [openCollapseConfig, setOpenCollapseConfig] = useState(false);

  return (
    <Container>
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
        <Link to="products">Produto</Link>
      </Option>
      <Option>
        <img src={Fornecedor} style={{ width: 32, height: 32 }}/>
        <Link to="supplier">Fornecedor</Link>
      </Option>
      <Option>
        <img src={Estoque} style={{ width: 32, height: 32 }}/>
        <Link to="stock">Estoque</Link>
      </Option>
      <Option>
        <SettingsIcon style={{ width: 30, height: 30 }} />
        <Link to="settings">Configurações</Link>
        <IconButton onClick={() => setOpenCollapseConfig(!openCollapseConfig)} style={{ width: 30, height: 30, paddingRight: 8 }}>
          {openCollapseConfig ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
        
      </Option>
      <Collapse in={!openCollapseConfig}>
        <Option style={{paddingLeft: 32}}>
          <PersonIcon style={{ width: 30, height: 30 }} />
          <Link to="users">Usuários</Link>
        </Option>
      </Collapse>
    </Container>
  );
}