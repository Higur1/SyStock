import React from 'react';
import PropTypes from 'prop-types';

import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

import Stock from '../../images/stock.png';
import Supply from '../../images/parcela.png';
import { SvgIcon } from '@mui/material';

const IconCustom = ({type, color="#424242"}) => {

  switch(type) {
    case 'home': {
      return <HomeIcon />;
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
    case 'googleMaps': {


      return (
        <SvgIcon>
          <svg width="24px" height="24px" viewBox="-55.5 0 367 367" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
            <g>
              <path d="M70.5853976,271.865254 C81.1995596,285.391378 90.8598594,299.639537 99.4963338,314.50654 C106.870174,328.489419 109.94381,337.97007 115.333495,354.817346 C118.638014,364.124835 121.625069,366.902652 128.046515,366.902652 C135.045169,366.902652 138.219816,362.176756 140.672953,354.867852 C145.766819,338.95854 149.763988,326.815514 156.069992,315.343493 C168.443902,293.193112 183.819296,273.510299 198.927732,254.592287 C203.018698,249.238677 229.462067,218.047767 241.366994,193.437035 C241.366994,193.437035 255.999233,166.402027 255.999233,128.645368 C255.999233,93.3274168 241.569017,68.8321265 241.569017,68.8321265 L200.024428,79.9578224 L174.793197,146.408963 L168.552129,155.57215 L167.303915,157.231625 L165.64444,159.309576 L162.729537,162.628525 L158.56642,166.791642 L136.098575,185.09637 L79.928962,217.528279 L70.5853976,271.865254 Z" fill="#34A853">

              </path>
              <path d="M12.6120081,188.891517 C26.3207125,220.205084 52.7568668,247.730719 70.6431185,271.8869 L165.64444,159.352866 C165.64444,159.352866 152.260416,176.856717 127.981579,176.856717 C100.939355,176.856717 79.0920095,155.2619 79.0920095,128.032084 C79.0920095,109.359386 90.325932,96.5309245 90.325932,96.5309245 L25.8373003,113.811107 L12.6120081,188.891517 Z" fill="#FBBC04">

              </path>
              <path d="M166.705061,5.78651629 C198.256727,15.959818 225.262874,37.3165365 241.597878,68.8104812 L165.673301,159.28793 C165.673301,159.28793 176.907223,146.228586 176.907223,127.671329 C176.907223,99.8065834 153.443693,78.990998 128.09702,78.990998 C104.128433,78.990998 90.3620076,96.4659886 90.3620076,96.4659886 L90.3620076,39.4666386 L166.705061,5.78651629 Z" fill="#4285F4">

              </path>
              <path d="M30.0148476,45.7654275 C48.8607087,23.2182162 82.0213432,0 127.736265,0 C149.915506,0 166.625695,5.82259183 166.625695,5.82259183 L90.2898565,96.5164943 L36.2054099,96.5164943 L30.0148476,45.7654275 Z" fill="#1A73E8">

              </path>
              <path d="M12.6120081,188.891517 C12.6120081,188.891517 0,164.194204 0,128.414485 C0,94.5972757 13.145926,65.0369799 30.0148476,45.7654275 L90.3331471,96.5237094 L12.6120081,188.891517 Z" fill="#EA4335">

              </path>
            </g>
          </svg>
        </SvgIcon>
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