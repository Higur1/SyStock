import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template: 48px 1fr / 1fr;
  gap: 32px;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: hidden;
`

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-direction: row-reverse;
`

export const TableContainer = styled("div")({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  borderRadius: '8px',
  background: "#ebebeb",
  border: '1px solid #d3D3D3',
  minWidth: 743
});

export const TableRow = styled("div")({
  width: '100%',
  display: 'flex',
  gap: '16px',
  height: '48px',
  padding: '0px 8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #d3D3D3',
});

export const TableData = styled("div")(({minWidth, width}) => ({
  minWidth,
  width,
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  fontWeight: 600,
  boxSizing: 'border-box'
}));