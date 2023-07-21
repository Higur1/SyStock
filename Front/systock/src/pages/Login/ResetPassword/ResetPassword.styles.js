import styled from "styled-components";

export const ResetPasswordContainer = styled("div")({
  display: 'flex',
  width: '700px',
  minWidth: '700px',
  borderRadius: '16px',
  minHeight: '450px',
  height: '450px',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#FFF',
  '-webkit-box-shadow': '0px 0px 8px 0px rgba(0,0,0,0.5)',
  '-moz-box-shadow': '0px 0px 8px 0px rgba(0,0,0,0.5)',
  boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.5)'
});

export const Main = styled("div")({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  background: "#4a7b9d"
});

export const FormContainer = styled("div")({
  borderRadius: '0px 16px 16px 0px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 32,
  padding: '16px'
});

export const TextContainer = styled("div")(({error}) => ({
  color: error ? "red" : "black"
}));