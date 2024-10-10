/* eslint-disable no-debugger */
import { useContext, useEffect, useRef, useState } from "react";
import { performFetch, performFetchNoResult } from "../apiBase";
import { DEBUG_LOCAL, MainContext } from "../App";
import { ENTITIES } from "../utils/debug-local-helper";

export default function useSupplier() {

  const [suppliers, setSuppliers] = useState([]);
  
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
    getSuppliers();
  }, []);

  function convertResponseToSupplier(result) {
    const { supplier, address, phones } = result;

    const phonesArray = Object.values(phones);

    const newObject = {...supplier, Phone: phonesArray, Address: [{...address}]};

    return newObject;
  }

  function convertSupplierDialogToBody(obj) {
    const sup = {};
    let phones = [];
    const address = {};

    obj.forEach(atr => {
      switch(atr.key) {
        case 'id':
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

    return sup;
  } 

  async function getSuppliers() {
    if(DEBUG_LOCAL) {
      const suppliers = getData(ENTITIES.SUPPLIERS);
      return setSuppliers(suppliers);
    }
    try {
      const obj = await performFetch("/suppliers", {method: 'GET'});
      const suppliers = obj.suppliers;
      setSuppliers(suppliers.map(sup => {
        const Phone = sup.Phone.map((phone, index) => ({...phone, isSelected: index === 0}));

        return {...sup, Phone};
      }) );
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createSupplier(obj) {

    if(DEBUG_LOCAL) {
      const nextSuppliers = [...suppliers, obj];
      setSuppliers(nextSuppliers);
      return updateData(ENTITIES.SUPPLIERS);
    }

    handleOpenSnackBar("info", "Fornecedor está sendo adicionado");

    const sup = convertSupplierDialogToBody(obj);

    try {
      const newItem = await performFetch("/supplier", {method: 'POST', body: JSON.stringify(sup)});
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }
      
      console.log(newItem);
      const supplierUpdated = convertResponseToSupplier(newItem);
      console.log(supplierUpdated);
      setSuppliers(prevState => {
        return [...prevState, supplierUpdated];
      });
      
      handleOpenSnackBar("success", "Fornecedor adicionado com sucesso!!", 3500)

    } catch (error) {
      handleOpenSnackBar("error", error.error, 3500);
    }
  }

  async function updateSupplier(obj) {
    if(DEBUG_LOCAL) {
      const nextSuppliers = suppliers.map(sup => sup.id === obj.id ? {...obj} : {...sup});
      setSuppliers(nextSuppliers);
      return updateData(ENTITIES.SUPPLIERS);
    }

    handleOpenSnackBar("info", "Fornecedor está sendo atualizado");

    const sup = convertSupplierDialogToBody(obj);

    try {
      const newItem = await performFetch("/supplier", {method: 'PUT', body: JSON.stringify(sup)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      const supplierUpdated = convertResponseToSupplier(newItem);
      setSuppliers(prevState => {
        return prevState.map(sup => sup.id === supplierUpdated.id ? {...supplierUpdated} : {...sup});
      });
      
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
    if(DEBUG_LOCAL) {
      const nextSuppliers = suppliers.filter(cat => cat.id !== id.id);
      setSuppliers(nextSuppliers);
      return updateData(ENTITIES.SUPPLIERS);
    }
    const url = "/supplier";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      setSuppliers(prevState => prevState.filter(cat => cat.id !== id.id));
      handleOpenSnackBar("success", "Fornecedor apagado com sucesso!!", 3500)
    })
    .catch(e => handleOpenSnackBar("error", e.message, 3500))
    ;
  }

  function handleChangeSelectedPhone(value, index) {
    setSuppliers((prevState) => {
      return prevState.map((sup,i) => {
        const Phone = sup.Phone.map((pho,ind) => ({...pho, isSelected: ind === value}));

        return i === index ? {...sup, Phone} : {...sup};
      });
    });
  }

  return {
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier, updateSupplier, handleDeleteSupplier,
    handleChangeSelectedPhone
  }
}