import { useState } from "react";
import { performFetch } from "../../apiBase";

export const useLogin = () => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    user: false,
    password: false
  });

  const onChangeUser = (event) => {
    setUser(event.target.value);
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  }

  const verifyUserRequirements = () => {
    let hasError = false;
    if(user === '') hasError = true;

    return hasError;
  }

  async function onLogin () {
    const hasError = verifyUserRequirements();
    if(hasError) {
      setError({
        ...error, user: hasError 
      });
      return;
    }
    try {
      const result = await performFetch("/auth", {
        method: "POST", 
        body: JSON.stringify({user_login: user, user_password: password})
      });
      console.log(result);
      //* set on localstorage
    } catch {
      setError({
        ...error, user: hasError 
      });
    }
  }

  const onForgotPassword = () => {
    alert('send');
  }

  const onSeePrice = () => {
    console.log('ver preços');
  }

  return {
    user, onChangeUser,
    password, onChangePassword,
    error,
    onLogin, onSeePrice, onForgotPassword
  };
}