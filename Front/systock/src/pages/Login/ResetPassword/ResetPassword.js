import React, { useEffect, useState } from 'react'
import { FormContainer, Main, ResetPasswordContainer, TextContainer } from './ResetPassword.styles';
import InputCustom from '../../../components/common/InputCustom/InputCustom';
import { CircularProgress, InputAdornment } from '@mui/material';
import { Key, Visibility, VisibilityOff } from '@mui/icons-material';
import ButtonCustom from '../../../components/common/ButtonCustom/ButtonCustom';
import UsersActions from '../../../Service/Users/UsersActions';

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const route = window.location.pathname;
  
    const tokenFromRoute = route.replace('/reset/password/', '');
    setToken(tokenFromRoute);
  }, []);

  const handleConfirm = async () => {
    if(password !== confirmPassword) {
      return setError("As senhas não correspondem!");
    } 

    try {
      await UsersActions.resetPassword({token, user_password: password});

      handleSuccess();

    } catch (e) {
      return setError(e);
    }
  }

  const handleSuccess = () => {
    setSuccess(true);

    setTimeout(() => {
      window.location.pathname = 'login';
    }, 3000);
  };

  return (
    <Main>
      {success ? (
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700}}>
          {"Você será redirecionado para a tela de Login!!"}
          <CircularProgress />
        </div>
      ) : (
          <ResetPasswordContainer>
          <FormContainer>

            <TextContainer error={error !== null}>
              {error ? error : "Redefine sua senha!!"}
            </TextContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InputCustom
                label={"Senha"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
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
              <InputCustom
                label={"Confirme sua senha"}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                required
                color={"primary"}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Key /></InputAdornment>,
                  endAdornment: <InputAdornment position="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</InputAdornment>
                }}
                value={confirmPassword}
              />
            </div>

            <ButtonCustom fullWidth label={"Confirmar"} onClick={handleConfirm} variant={"contained"}/>
          </FormContainer>
          </ResetPasswordContainer>
      )}
      
    </Main>
  );
}

export default ResetPassword;