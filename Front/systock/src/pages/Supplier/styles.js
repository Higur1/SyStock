import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  height: 100%;
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