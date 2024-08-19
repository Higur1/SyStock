import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template:
    "span" 32px
    "filter" 60px
    "divider" 1px
    "buttons" 48px
    "table" 1fr
    / 1fr;
  gap: 16px;
  width: 100%;
  height: 100vh;
  padding: 16px;
`

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`

export const TableContainer = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  background: "#ebebeb",
  border: '1px solid #d3D3D3',
  height: "100%"
});

export const TableRow = styled("div")({
  width: '100%',
  display: 'flex',
  gap: 16,
  height: '48px',
  padding: '0px 8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #d3D3D3'
});

export const TableData = styled("div")(() => ({
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  fontWeight: 600
}));

export const Menu = styled("div")({
  display: 'flex',
  position: 'absolute',
  width: 200,
  flexDirection: 'column',
  borderRadius: '16px',
  background: "#fff",
  right: '40px',
  border: '1px solid #C3C3C3',
  top: 0
});

export const MenuOption = styled("div")({
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 40,
  paddingLeft: '8px',
  borderBottom: '1px solid #C3C3C3',
  color: 'black',
  "&:hover": {
    background: '#DCDCDC'
  }
});