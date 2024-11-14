import { Link } from 'react-router-dom';
import { Option, Container } from './styles.js';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import Estoque from '../../images/stock.png';
import Fornecedor from '../../images/parcela.png';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse, IconButton } from '@mui/material';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconCustom from '../../components/common/IconCustom.js';

export default function Sidebar({logOff}) {

  const [options, setOptions] = useState([
    {
      type: 'home', 
      label: 'Página Inicial', 
      child: [],
      selected: window.location.pathname.indexOf('home') !== -1,
      openCollapse: false
    },
    {
      type: 'products', 
      label: 'Produto', 
      child: [],
      selected: window.location.pathname.indexOf('products') !== -1,
      openCollapse: false
    },
    {
      type: 'categories', 
      label: 'Categoria', 
      child: [],
      selected: window.location.pathname.indexOf('categories') !== -1,
      openCollapse: false
    },
    {
      type: 'suppliers', 
      label: 'Fornecedor', 
      child: [],
      selected: window.location.pathname.indexOf('suppliers') !== -1,
      openCollapse: false
    },
    {
      type: 'history', 
      label: 'Históricos', 
      child: [],
      selected: window.location.pathname.indexOf('history') !== -1,
      openCollapse: false
    },
    // {
    //   type: 'sellRegisters', 
    //   label: 'Registros de venda', 
    //   child: [],
    //   selected: window.location.pathname.indexOf('sellRegisters') !== -1,
    //   openCollapse: false
    // },
    {
      type: 'settings', 
      label: 'Configurações', 
      child: [],
      selected: window.location.pathname.indexOf('settings') !== -1,
      openCollapse: false
    },
  ]);

  const handleCollapse = (type) => {
    let updatedOptions = options.map(opt => (opt.type === type ? {...opt, openCollapse: !opt.openCollapse} : {...opt}));

    setOptions(updatedOptions);
  }

  return (
    <Container>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {options.map((option, index) => {

          return (
          <React.Fragment key={index}>
            <Option selected={`${window.location.pathname.indexOf(option.type) !== -1}`}>
              <IconCustom type={option.type} />
              <Link to={option.type}>{option.label}</Link>
              {option.child.length !== 0 ? (
                <IconButton onClick={() => handleCollapse(option.type)} style={{ width: 30, height: 30, paddingRight: 8 }}>
                  {option.openCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              ) : null}
            </Option>
            <Collapse in={option.openCollapse}>
              {option.child.map((optionChild, i) => (
                <Link key={option.type + i} to={optionChild.type} style={{paddingLeft: 32}}>
                  <Option selected={`${option.selected}`}>
                    <IconCustom type={option.type} />
                    {optionChild.label}
                  </Option>
                </Link>
              ))}
            </Collapse>
          </React.Fragment>
            
          );
        })}
      </div>
      
      <Option onClick={logOff} selected={`${Boolean(0)}`}>
        <IconCustom type={"logOut"} />
        <p>{"Sair da Conta"}</p>
      </Option>
    </Container>
  );
}

Sidebar.propTypes = {
  logOff: PropTypes.func
}