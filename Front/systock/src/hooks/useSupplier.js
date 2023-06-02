/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from "react";
import { deepCopy } from "../utils/utils";
import { performFetch, performFetchNoResult } from "../apiBase";

export default function useSupplier() {

  const [suppliers, setSuppliers] = useState([]);
  
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
    getSuppliers();
  }, []);

  async function getSuppliers() {
    try {
      const suppliers = await performFetch("/suppliers", {method: 'GET'});
      setSuppliers(suppliers);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createSupplier(obj) {
    try {
      const newItem = await performFetch("/suppliers/new", {method: 'POST', body: JSON.stringify(obj)});
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const suplist = [...suppliers, newItem];
      setSuppliers(suplist);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function updateSupplier(sup) {
    try {
      const newItem = await performFetch("/suppliers/update", {method: 'PUT', body: JSON.stringify(sup)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const suplist = suppliers.map(sup => (sup.id === newItem.id ? {...newItem} : {...sup}));
      setSuppliers(suplist);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteSupplier(id) {
    const url = "/supplier/delete";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      const suppliersList = suppliers.filter(cat => cat.id !== id.id);
      setSuppliers(suppliersList);
    })
    .catch(e => handleOpenSnackBar("error", e.message, 3500))
    ;
  }

  return {
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier, updateSupplier, handleDeleteSupplier
  }
}