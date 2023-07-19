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

  const [options, setOptions] = useState([
    {
      type: 'dashboard', 
      label: 'Dashboard', 
      child: [],
      openCollapse: false
    },
    {
      type: 'categories', 
      label: 'Categoria', 
      child: [],
      openCollapse: false
    },
    {
      type: 'products', 
      label: 'Produto', 
      child: [],
      openCollapse: false
    },
    {
      type: 'suppliers', 
      label: 'Fornecedor', 
      child: [],
      openCollapse: false
    },
    {
      type: 'stock', 
      label: 'Estoque', 
      child: [],
      openCollapse: false
    },
    {
      type: 'settings', 
      label: 'Configurações', 
      child: [
        {
          type: 'users', 
          label: 'Usuários', 
          child: [],
          openCollapse: false
        }
      ],
      openCollapse: false
    },
  ]);

  const handleCollapse = (type) => {
    let updatedOptions = options.map(opt => (opt.type === type ? {...opt, openCollapse: !opt.openCollapse} : {...opt}));

    setOptions(updatedOptions);
  }

  return (
    <Container>
      {options.map((option, index) => {

        return (
        <>
          <Option key={option.type + index}>
            {/* icon */}
            <Link to={option.type}>{option.label}</Link>
            {option.child.length !== 0 ? (
              <IconButton onClick={() => handleCollapse(option.type)} style={{ width: 30, height: 30, paddingRight: 8 }}>
                {option.openCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            ) : null}
          </Option>
          <Collapse in={option.openCollapse}>
            {option.child.map((optionChild, i) => (
              <Option key={option.type + i}>
                {/* icon */}
                <Link to={optionChild.type} style={{paddingLeft: 32}}>{optionChild.label}</Link>
              </Option>
            ))}
          </Collapse>
        </>
          
        );
      })}
    </Container>
  );
}