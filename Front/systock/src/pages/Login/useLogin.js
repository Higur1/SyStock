import { useContext, useState } from "react";
import { ENTITIES } from "../../utils/debug-local-helper";
import { DEBUG_LOCAL, MainContext } from "../../App";
import UsersActions from "../../Service/Users/UsersActions";
import Account from "../../classes/Account";
import { CURRENT_INSTANCE } from "../../utils/utils";

export const useLogin = () => {

  const { handleOpenSnackBar } = useContext(MainContext);

  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    user: '',
    password: '',
    email: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstAccess, setFirstAccess] = useState({email: "", name: "", user: "", password: ""});

  const { getData } = useContext(MainContext);

  const handleScreen = (scr) => {
    setScreen(scr);
  }

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
      const token = await UsersActions.login({user, password});
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
    if(regex.test(email)) {
      setError({...error, email: ''});

      try {
        await UsersActions.recovery({email, instance: CURRENT_INSTANCE});
        
        handleScreen("login");
        handleOpenSnackBar('success','A recuperação de senha foi enviada ao seu e-mail!!', 3000);
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
      await UsersActions.create(account);
      handleOpenSnackBar('success','O usuário foi criado!', 3000);
      handleScreen("login");
    } catch (e) {
      
      handleOpenSnackBar('error',e, 3000);
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
    loading,
    firstAccess, handleChangeFirstAccess, onCreateFirstAccess,
    screen, handleScreen
  };
}