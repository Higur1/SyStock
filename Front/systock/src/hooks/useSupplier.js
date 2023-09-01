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
      const obj = await performFetch("/suppliers", {method: 'GET'});
      const suppliers = obj.suppliers;
      setSuppliers(suppliers);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createSupplier(obj) {

    handleOpenSnackBar("info", "Fornecedor está sendo adicionado");

    const sup = {};
    let phones = [];
    const address = {};

    obj.forEach(atr => {
      if(['name', 'email'].includes(atr.key)) {
        sup[atr.key] = atr.value;
      }
      switch(atr.key) {
        case 'name':
        case 'email':
          sup[atr.key] = atr.value;
          break;
        case 'phone1':
        case 'phone2':
          phones.push(atr.value);
          break;
        case 'cep':
        case 'street':
        case 'number':
        case 'district':
        case 'state':
        case 'city':
        case 'complement': {
          let value = atr.value;
          if(atr.key === 'number') {
            value = parseInt(atr.value);
          }
          address[atr.key] = value;
          break;
        }
        default:
          break;
      }
    });

    sup.phones = phones;
    sup.address = address;

    try {
      const newItem = await performFetch("/supplier", {method: 'POST', body: JSON.stringify(sup)});
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }
      const suplist = [...suppliers, {...newItem[0], Phones: newItem[1]}];
      setSuppliers(suplist);
      
      handleOpenSnackBar("success", "Fornecedor adicionado com sucesso!!", 3500)

    } catch (error) {
      handleOpenSnackBar("error", error.error, 3500);
    }
  }

  async function updateSupplier(sup) {
    try {
      const newItem = await performFetch("/suppliers/update", {method: 'PUT', body: JSON.stringify(sup)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const suplist = suppliers.map(sup => (sup.id === newItem[0].id ? {...newItem[0], Phones: newItem[1]} : {...sup}));
      setSuppliers(suplist);
      
      handleOpenSnackBar("success", "Fornecedor atualizado com sucesso!!", 3500);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteSupplier(id) {
    const url = "/suppliers/delete";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      const suppliersList = suppliers.filter(cat => cat.id !== id.id);
      setSuppliers(suppliersList);
      handleOpenSnackBar("success", "Fornecedor apagado com sucesso!!", 3500)
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