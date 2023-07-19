import { useState } from "react";
import { performFetch } from "../../apiBase";

export const useLogin = ({setIsLoggedIn}) => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    user: false,
    password: false,
    email: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeUser = (event) => {
    setUser(event.target.value);
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  }

  const onChangeEmail = (event) => {
    const email = event.target.value;
    setError({...error, email: ''});
    setEmail(email);
  }

  const verifyUserRequirements = () => {
    let hasError = false;
    if(user === '') hasError = true;

    return hasError;
  }

  async function onLogin () {
    setLoading(true);
    const hasError = verifyUserRequirements();
    if(hasError) {
      setError({
        ...error, user: hasError 
      });
      setLoading(false);
      return;
    }
    try {
      const result = await performFetch("/auth", {
        method: "POST", 
        body: JSON.stringify({user_login: user, user_password: password})
      });
      console.log(result);
      window.localStorage.setItem('tokenLogin', result.token);
      setIsLoggedIn(true);
    } catch {
      setError({
        ...error, user: hasError 
      });
    }
    setLoading(false);
  }

  const onForgotPassword = () => {
    alert('send');
  }

  const onResetPassword = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(regex.test(email)) {
      setError({...error, email: ''});
    } else {
      setError({...error, email: 'Formato de e-mail inválido'});
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
      user: false,
      password: false,
      email: ''
    });
  }

  return {
    user, onChangeUser,
    password, onChangePassword,
    error,
    email, onChangeEmail, 
    onLogin, onForgotPassword, onResetPassword, clearInfo,
    loading
  };
}