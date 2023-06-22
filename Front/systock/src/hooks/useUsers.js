/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from "react";
import { deepCopy } from "../utils/utils";
import { performFetch, performFetchNoResult } from "../apiBase";

export default function useUsers() {

  const [users, setUsers] = useState([]);
  
  //* snackBar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [autoHideSnackBar, setAutoHideSnackBar] = useState(3000);
  const [severitySnackBar, setSeveritySnackBar] = useState("info");
  const [snackMessageSnackBar, setSnackMessageSnackBar] = useState("");

  function handleOpenSnackBar(severity, message="Unexpected Error Occurred", autoHide=3000) {
    setSnackMessageSnackBar(message);
    setSeveritySnackBar(severity);
    setAutoHideSnackBar(autoHide);
    setOpenSnackBar(true);
  }

  function handleCloseSnackBar() {
    setOpenSnackBar(false);
  }

  const isMount = useRef();

  useEffect(() => {
    if(isMount.current) return;
    
    isMount.current = true;
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const users = await performFetch("/users", {method: 'GET'});
      setUsers(users);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createUser(obj) {
    try {
      const newItem = await performFetch("/users/new", {method: 'POST', body: JSON.stringify(obj)});
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }
      const suplist = [...users, {...newItem[0], Phones: newItem[1]}];
      setUsers(suplist);
      
      handleOpenSnackBar("success", "Usuário adicionado com sucesso!!", 3500)

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function updateUser(sup) {
    try {
      const newItem = await performFetch("/users/update", {method: 'PUT', body: JSON.stringify(sup)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const suplist = users.map(sup => (sup.id === newItem[0].id ? {...newItem[0], Phones: newItem[1]} : {...sup}));
      setUsers(suplist);
      
      handleOpenSnackBar("success", "Usuário atualizado com sucesso!!", 3500);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteUser(id) {
    const url = "/users/delete";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      const usersList = users.filter(cat => cat.id !== id.id);
      setUsers(usersList);
      handleOpenSnackBar("success", "Usuário apagado com sucesso!!", 3500)
    })
    .catch(e => handleOpenSnackBar("error", e.message, 3500))
    ;
  }

  return {
    users, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createUser, updateUser, handleDeleteUser
  }
}