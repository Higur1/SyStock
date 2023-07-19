import { createTheme } from '@mui/material/styles';

export const CustomTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4a7b9d',
    },
    secondary: {
      main: '#9C27B0',
    },
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
  },
  shape: {
    borderRadius: 16,
  },
});