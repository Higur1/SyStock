import styled from "styled-components";

export const Container = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'black',
  gap: 16,
  justifyContent: 'center'
});

export const Card = styled('div')({
  height: '100%',
  maxHeight: 324,
  minWidth: 200,
  display: 'flex',
  flexDirection:'column',
  background: 'linear-gradient(135deg, #87CEFA 0%, #0a2fb6 175%)',
  borderRadius: 15,
  gap: 32,
  boxShadow: '0px 0px 6px 0px black',
  transition: 'transform 0.3s',
  "&:hover": {
    transform: 'scale(1.050)'
  }
});

export const Title = styled('div')({
  borderBottom: '2px solid #FFE4E1'
});

export const TitleH2 = styled('h2')({
  textAlign: 'center',
  fontSize: 35,
  color: '#E6E6FA'
});

export const Button = styled('button')({
  width: '120px',
  background: '#E6E6FA',
  borderRadius: '20px',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: '0.3s',
});

export const DivContainer = styled('div')({

})