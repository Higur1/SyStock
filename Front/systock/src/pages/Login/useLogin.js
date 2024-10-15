import { useContext, useState } from "react";
import { ENTITIES } from "../../utils/debug-local-helper";
import { DEBUG_LOCAL, MainContext } from "../../App";
import UsersActions from "../../Service/Users/UsersActions";
import Account from "../../classes/Account";

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
  const [firstAccess, setFirstAccess] = useState({email: "", name: "", user: "", password: ""});

  const { getData } = useContext(MainContext);

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

    if(DEBUG_LOCAL) {
      const accounts = getData(ENTITIES.ACCOUNTS);

      const i = accounts.findIndex(obj => obj.user === user && obj.password === password);
      if(i !== -1) {
        window.localStorage.setItem('tokenLogin', "connectLocal");
        window.location.pathname = 'home';
      } else {
        setError({
          ...error, user: 'Usuário ou senha incorretos!' 
        });
      }

      return setLoading(false);
    }

    try {
      const token = await UsersActions.login({user_login: user, user_password: password});
      window.localStorage.setItem('tokenLogin', token);
      window.location.pathname = 'home';
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
        const response = await UsersActions.recovery({email, instance});
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

  const onCreateFirstAccess = async () => {
    const account = new Account({...firstAccess});

    try {
      const userCreated = await UsersActions.create(account);

      if(!(userCreated instanceof Account)) return;

      setSnackBar({
        ...snackBar, 
        open: true, 
        severity: 'success', 
        snackMessage: 'O usuário foi criado!',
        autoHide: 3000,
        handleClose: closeSnackBar
      });
    } catch (e) {
      setSnackBar({
        ...snackBar, 
        open: true, 
        severity: 'error', 
        snackMessage: e,
        autoHide: 3000,
        handleClose: closeSnackBar
      });
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

  function handleChangeFirstAccess(type, value) {
    setFirstAccess(prev => ({...prev, [type]: value}));
  }

  return {
    user, onChangeUser,
    password, onChangePassword,
    error,
    email, onChangeEmail, 
    onLogin, onResetPassword, clearInfo,
    loading, snackBar,
    firstAccess, handleChangeFirstAccess, onCreateFirstAccess
  };
}