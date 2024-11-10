/* eslint-disable no-debugger */
import { useContext, useEffect, useRef, useState } from "react";
import { DEBUG_LOCAL, MainContext } from "../App";
import { ENTITIES } from "../utils/debug-local-helper";
import UsersActions from "../Service/Users/UsersActions";

export default function useUsers() {

  const [users, setUsers] = useState([]);
  
  //* snackBar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [autoHideSnackBar, setAutoHideSnackBar] = useState(3000);
  const [severitySnackBar, setSeveritySnackBar] = useState("info");
  const [snackMessageSnackBar, setSnackMessageSnackBar] = useState("");

  const { updateData, getData } = useContext(MainContext);

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
    if(DEBUG_LOCAL) {
      const users = getData(ENTITIES.ACCOUNTS);
      return setUsers(users);
    }
    try {
      const users = await UsersActions.getAll();
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  }

  async function createUser(obj) {
    if(DEBUG_LOCAL) {
      const nextUsers = [...users, obj];
      setUsers(nextUsers);
      return updateData(ENTITIES.ACCOUNTS, nextUsers);
    }

    try {
      const newItem = await UsersActions.create(obj);
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }
      const suplist = [...users, {...newItem[0], Phones: newItem[1]}];
      setUsers(suplist);
      
      handleOpenSnackBar("success", "Usuário adicionado com sucesso!!", 3500)

    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    }
  }

  async function updateUser(sup) {
    if(DEBUG_LOCAL) {
      const nextUsers = users.map(user => (user.id === sup.id ? sup : user));
      setUsers(nextUsers);
      return updateData(ENTITIES.ACCOUNTS, nextUsers);
    }
    try {
      const newItem = await UsersActions.update(sup);
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const suplist = users.map(sup => (sup.id === newItem[0].id ? {...newItem[0], Phones: newItem[1]} : {...sup}));
      setUsers(suplist);
      
      handleOpenSnackBar("success", "Usuário atualizado com sucesso!!", 3500);

    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteUser(id) {
    try {
      await UsersActions.delete(id);

      const usersList = users.filter(cat => cat.id !== id.id);
      setUsers(usersList);
      handleOpenSnackBar("success", "Usuário apagado com sucesso!!", 3500)
    } catch (e) {
      handleOpenSnackBar("error", e, 3500);
    }
  }

  return {
    users, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createUser, updateUser, handleDeleteUser
  }
}