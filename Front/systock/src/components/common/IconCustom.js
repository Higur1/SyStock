import React from 'react';
import PropTypes from 'prop-types';

import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import Stock from '../../images/stock.png';
import Supply from '../../images/parcela.png';

const IconCustom = ({type, color="#424242"}) => {

  switch(type) {
    case 'dashboard': {
      return <DashboardIcon />;
    }
    case 'categories': {
      return <CategoryIcon />;
    }
    case 'products': {
      return <InventoryIcon />;
    }
    case 'settings': {
      return <SettingsIcon />;
    }
    case 'users': {
      return <PersonIcon />;
    }
    case 'suppliers': {
      return (
        <img src={Supply} alt={type} style={{width: 24, height: 24}}/>
      );
    }
    case 'stock': {
      return (
        <img src={Stock} alt={type} style={{width: 24, height: 24}}/>
      );
    }
    case 'logOut': {
      return (
        <LogoutIcon />
      );
    }
    default:
      return null;
  }

}

export default IconCustom;

IconCustom.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
}