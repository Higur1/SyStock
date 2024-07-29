import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import { Container, FormContainer, InfoContainer, Main, ResetPasswordContainer, TextContainer } from './Login.styles'
import { Backdrop, CircularProgress, InputAdornment, Typography } from '@mui/material'
import InputCustom from '../../components/common/InputCustom/InputCustom'
import { useState } from 'react'
import { AccountCircle, Key, Visibility, VisibilityOff } from '@mui/icons-material'
import ButtonCustom from '../../components/common/ButtonCustom/ButtonCustom'
import { useLogin } from './useLogin'
import styled from 'styled-components'
import CustomizedSnackbars from '../../components/CustomizedSnackBar';

const DivColumnFlex8 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 8 });
const DivGrid8 = styled("div")({ display: 'grid', gap: 8, gridTemplate: '1fr / 50% 50%' });
const DivColumnFlex16 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 16 });
const DivColumnFlex32 = styled("div")({ display: 'flex', flexDirection: 'column', gap: 24 });

const Login = () => {

  const {
    user, onChangeUser,
    password, onChangePassword,
    error,
    email, onChangeEmail,
    snackBar,
    onLogin, onResetPassword, clearInfo,
    loading
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState("login");

  const mountSnackBar = useRef();

  useEffect(() => {
    if(snackBar.open) {
      mountSnackBar.current = true;
      return;
    }

    if(mountSnackBar.current) {
      console.log('funcionou current');
      setScreen("login");
    }
  }, [snackBar.open]);


  const handleScreen = (scr) => {
    setScreen(scr);
  }

  return (
    <>
      {(screen === "login" || screen === "forgotPassword") && (
        <Main>
          {screen === "login" && (
            <Container>
              {screen === "login" && (
                <>
                  <InfoContainer>
                    {"LOGO HERE"}
                    {/* <ButtonCustom
                      style={{
                        padding: '4px 16px',
                        bottom: 25,
                        left: 20,
                        position: 'absolute'
                      }}
                      onClick={handleOpenPrices}
                      variant="outlined"
                      fullWidth={false}
                      color='primary'
                      label={"Ver Preços"}
                    /> */}
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
                        <div style={{display: 'flex', gap: 2, flexDirection: 'column'}}>
                          <InputCustom
                            label={"Senha"}
                            onChange={onChangePassword}
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            color={"primary"}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><Key /></InputAdornment>,
                              endAdornment: <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</InputAdornment>
                            }}
                            value={password}
                            onKeyDown={(e) => {
                              if(error.password !== '' || error.user !== '') return;
                              if (e.keyCode === 13) {
                                onLogin();
                              }
                            }}
                          />
                          {error.user !== '' && (
                            <p style={{color: 'red'}}>{error.user}</p>
                          )}
                        </div>
                        
                      </DivColumnFlex16>
                      <DivColumnFlex8>
                        <ButtonCustom fullWidth label={"Entrar"} onClick={onLogin} variant={"contained"} />
                        <ButtonCustom fullWidth label={"Esqueci a senha"} onClick={() => handleScreen("forgotPassword")} variant={"text"} style={{ fontSize: 12 }}/>
                      </DivColumnFlex8>
                    </DivColumnFlex32>
                  </FormContainer>
                </>
              )}
            </Container>
          )}
          
          {screen === "forgotPassword" && (
            <ResetPasswordContainer>
              <FormContainer style={{width: 370}}>
                <TextContainer error={error.email !== ''}>
                  {error.email !== '' ? error.email : "Digite o e-mail cadastrado para redefinir a sua senha!"}
                </TextContainer>
                <InputCustom
                  label={"E-mail"}
                  onChange={onChangeEmail}
                  autoFocus
                  fullWidth
                  required
                  color={"primary"}
                  error={error.email !== ''}
                  value={email}
                />
                <DivGrid8>
                  <ButtonCustom label={"Voltar"} onClick={() => {
                    handleScreen("login");
                    clearInfo("login");
                  }} variant={"outlined"} 
                  />
                  <ButtonCustom fullWidth label={"Confirmar"} onClick={onResetPassword} variant={"contained"} disabled={error.email !== ''}/>
                </DivGrid8>
                
              </FormContainer>
            </ResetPasswordContainer>
          )}
        </Main>
      )}
      {loading && (
        <Backdrop open>
          <CircularProgress color="primary" />
        </Backdrop>
      )}

      {snackBar.open && (
        <CustomizedSnackbars {...snackBar} />
      )}
    </> 
  )
}

export default Login