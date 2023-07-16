import { useState } from "react";
import { performFetch } from "../../apiBase";

export const useLogin = () => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const onChangeUser = (event) => {
    setUser(event.target.value);
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  }

  async function onLogin () {
    try {
      const result = await performFetch("/auth", {
        method: "POST", 
        body: JSON.stringify({user_login: user, user_password: password})
      });
      console.log(result);
      //* set on localstorage
    } catch {
      //* set error
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
    onLogin, onSeePrice, onForgotPassword
  };
}