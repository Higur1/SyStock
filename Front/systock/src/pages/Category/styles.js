import { TableCell, styled } from '@mui/material';

export const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  width: '100%',
  height: '100%'
});

export const HeaderContainer = styled("div")({
  width: '100%',
  display: 'flex',
  justifyContent: "space-between",
  gap: 16
});

export const ColumnTable = styled(TableCell)({
  height: 47,
  padding: '0px 8px',
});

export const CellContainer = styled("div")({
  display: 'flex',
  alignItems: 'center'
});