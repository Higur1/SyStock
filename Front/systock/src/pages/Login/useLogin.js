import { useState } from "react";
import { performFetch, performFetchNoResult } from "../../apiBase";

export const useLogin = () => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    user: '',
    password: '',
    email: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [snackBar, setSnackBar] = useState({
    open: false, 
    severity: "",
    snackMessage: "",
    autoHide: 5000,
    handleClose: null
  });

  const onChangeUser = (event) => {
    setError({...error, user: ''});
    setUser(event.target.value);
  }

  const onChangePassword = (event) => {
    setError({...error, password: ''});
    setPassword(event.target.value);
  }

  const onChangeEmail = (event) => {
    const email = event.target.value;
    setError({...error, email: ''});
    setEmail(email);
  }

  const closeSnackBar = () => {
    console.log('closeSnackBar');
    setSnackBar({
      open: false, 
      severity: "",
      snackMessage: "",
      autoHide: 3000,
      handleClose: null
    });
  }

  async function onLogin () {
    setLoading(true);

    try {
      const result = await performFetch("/auth", {
        method: "POST", 
        body: JSON.stringify({user_login: user, user_password: password})
      });
      console.log(result);
      window.localStorage.setItem('tokenLogin', result.token);
      window.location.pathname = 'dashboard';
    } catch {
      setError({
        ...error, user: 'Usuário ou senha incorretos!' 
      });
    }
    setLoading(false);
  }

  const onResetPassword = async () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const instance =  window.location.href.split('/')[2];
    if(regex.test(email)) {
      setError({...error, email: ''});

      try {
        const response = await performFetchNoResult("/recovery", {
          method: "POST", 
          body: JSON.stringify({email, instance})
        });
        console.log('onReset', response.ok);

        if(!response.ok) {
          return setError({...error, email: 'E-mail não encontrado. Digite o e-mail novamente.'});
        }
        
        setSnackBar({
          ...snackBar, 
          open: true, 
          severity: 'success', 
          snackMessage: 'A recuperação de senha foi enviada ao seu e-mail!!',
          autoHide: 3000,
          handleClose: closeSnackBar
        });

      } catch {
        return setError({...error, email: 'E-mail não encontrado. Digite o e-mail novamente.'});
      }
    } else {
      return setError({...error, email: 'Formato de e-mail inválido.'});
    }
  }

  const clearInfo = (screen) => {
    switch(screen) {
      case "login": {
        setUser('');
        setPassword('');
        break;
      }
      case "resetPassword": {
        setEmail('');
        break;
      }
      default:
        return;
    }
    setError({
      user: '',
      password: '',
      email: ''
    });
  }

  return {
    user, onChangeUser,
    password, onChangePassword,
    error,
    email, onChangeEmail, 
    onLogin, onResetPassword, clearInfo,
    loading, snackBar
  };
}