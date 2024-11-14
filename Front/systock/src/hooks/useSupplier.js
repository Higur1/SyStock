/* eslint-disable no-debugger */
import { useContext, useEffect, useRef, useState } from "react";
import { DEBUG_LOCAL, MainContext } from "../App";
import { ENTITIES } from "../utils/debug-local-helper";
import SupplierActions from "../Service/Supplier/SupplierActions";
import Supplier from "../classes/Supplier";

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
        case 'phone':
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
      const suppliers = await SupplierActions.getAll();
      setSuppliers(suppliers);
    } catch (error) {
      handleOpenSnackBar("error", error);
    }
  }

  async function createSupplier(obj = new Supplier()) {
    handleOpenSnackBar("info", "Fornecedor está sendo adicionado");

    try {
      const newItem = await SupplierActions.create(obj);
    
      setSuppliers(prevState => {
        return [...prevState, newItem];
      });
      
      handleOpenSnackBar("success", "Fornecedor adicionado com sucesso!!", 3500)

    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    }
  }

  async function updateSupplier(obj = new Supplier()) {

    handleOpenSnackBar("info", "Fornecedor está sendo atualizado");

    try {
      const newItem = await SupplierActions.update(obj);

      setSuppliers(prevState => {
        return prevState.map(sup => sup.id === obj.id ? {...newItem} : {...sup});
      });
      
      handleOpenSnackBar("success", "Fornecedor atualizado com sucesso!!", 3500);

    } catch (error) {
      handleOpenSnackBar("error", error, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteSupplier({id}) {
    try {
      await SupplierActions.delete(id);
      setSuppliers(prevState => prevState.filter(cat => cat.id !== id));
      handleOpenSnackBar("success", "Fornecedor apagado com sucesso!!", 3500);
    } catch (e) {
      handleOpenSnackBar("error", e, 3500);
    }
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