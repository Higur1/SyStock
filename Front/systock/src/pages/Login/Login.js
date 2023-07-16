import React from 'react'
import { Container, FormContainer, InfoContainer, Main } from './Login.styles'
import { InputAdornment, Typography } from '@mui/material'
import InputCustom from '../../components/common/InputCustom/InputCustom'
import { useState } from 'react'
import { AccountCircle, Key, Visibility, VisibilityOff } from '@mui/icons-material'
import ButtonCustom from '../../components/common/ButtonCustom/ButtonCustom'
import { useLogin } from './useLogin'
import styled from 'styled-components'

const DivColumnFlex8 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 8 });
const DivColumnFlex16 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 16 });
const DivColumnFlex32 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 32 });

const Login = () => {

  const {
    user, onChangeUser,
    password, onChangePassword,
    onLogin, onSeePrice, onForgotPassword
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Main>
      <Container>
        <InfoContainer>
          {"LOGO HERE"}
          <ButtonCustom
            style={{
              padding: '4px 16px',
              bottom: 25,
              left: 20,
              position: 'absolute'
            }}
            onClick={onSeePrice}
            variant="outlined"
            fullWidth={false}
            color='primary'
            label={"Ver Preços"}
          />
        </InfoContainer>
        <FormContainer>
          <Typography color="textPrimary" variant="h4">{"Conecte-se"}</Typography>
          <DivColumnFlex32>
            <DivColumnFlex16>
              <InputCustom
                label={"Usuário"}
                onChange={onChangeUser}
                autoFocus
                fullWidth
                required
                color={"primary"}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>
                }}
                value={user}
              />
              <InputCustom
                label={"Senha"}
                onChange={onChangePassword}
                autoFocus
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                color={"primary"}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Key /></InputAdornment>,
                  endAdornment: <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</InputAdornment>
                }}
                value={password}
              />
            </DivColumnFlex16>
            <DivColumnFlex8>
              <ButtonCustom fullWidth label={"Entrar"} onClick={onLogin} variant={"contained"} />
              <ButtonCustom fullWidth label={"Esqueci a senha"} onClick={onForgotPassword} variant={"text"} style={{ fontSize: 12 }} />
            </DivColumnFlex8>
          </DivColumnFlex32>
        </FormContainer>
      </Container>
    </Main>
  )


}

export default Login