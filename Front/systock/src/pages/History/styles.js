import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template: 48px 48px 1fr / 1fr;
  gap: 32px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 16px;
`


export const TableContainer = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  background: "#ebebeb",
  border: '1px solid #d3D3D3',
  height: "100%",
  width: "100%"
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
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  fontWeight: 600
}));
