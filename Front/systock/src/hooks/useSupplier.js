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

  // //* UPDATE CATEGORY LIST WHEN CHOOSE
  // useEffect(() => {
  //   if(categories.length === 0) return;

  //   let filteredOptions = categories
  //     .filter(cat => selectedCategories
  //       .some(catSelected => catSelected === cat.name));

  //   setCategoriesFiltered(selectedCategories.length === 0 ? categories : filteredOptions);

  // }, [selectedCategories, categories]);

  // const insertCategory = (newCategory) => {
  //   const newItem = deepCopy(newCategory);
  //   let updatedCategories = [];
  //   if(categories.some(cat => cat.id === newItem.id)) {
  //     updatedCategories = categories.map(cat => (cat.id === newItem.id ? {...newItem} : {...cat}));
  //   } else {
  //     updatedCategories = [...categories, {...newItem}];
  //   }

  //   setCategories(updatedCategories);
  // }

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

  // async function handleUpdateCategory(category) {
  //   try {
  //     const newItem = await performFetch("/categories/update", {method: 'PUT', body: JSON.stringify(category)});
      
  //     if(typeof newItem === 'string') {
  //       handleOpenSnackBar("error", newItem, 3500);
  //       return;
  //     }

  //     insertCategory(newItem);

  //   } catch (error) {
  //     handleOpenSnackBar("error", error.message, 3500);
  //   }
  // }

  // /**
  //  * * delete category by id
  //  * @param {*} id 
  //  */
  // async function handleDeleteCategory(id) {
  //   const url = "/categories/delete";

  //   performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
  //   .then(() => {
  //     const updatedCategories = categories.filter(cat => cat.id !== id.id);
  //     setCategories(updatedCategories);
  //   })
  //   .catch(e => handleOpenSnackBar("error", e.message, 3500))
  //   ;
  // }

  return {
    suppliers, 
    openSnackBar, autoHideSnackBar, 
    severitySnackBar, snackMessageSnackBar, 
    handleCloseSnackBar,
    createSupplier
  }
}