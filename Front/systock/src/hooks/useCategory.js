/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from "react";
import { deepCopy } from "../utils/utils";
import { performFetch, performFetchNoResult } from "../apiBase";

export default function useCategory() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);
  
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
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const categories = await performFetch("/categories", {method: 'GET'});
      setCategories(categories);
    } catch (error) {
      console.log(error.message);
    }
  }

  //* UPDATE CATEGORY LIST WHEN CHOOSE
  useEffect(() => {
    if(categories.length === 0) return;

    let filteredOptions = categories
      .filter(cat => selectedCategories
        .some(catSelected => catSelected === cat.name));

    setCategoriesFiltered(selectedCategories.length === 0 ? categories : filteredOptions);

  }, [selectedCategories, categories]);

  const insertCategory = (newCategory) => {
    const newItem = deepCopy(newCategory);
    let updatedCategories = [];
    if(categories.some(cat => cat.id === newItem.id)) {
      updatedCategories = categories.map(cat => (cat.id === newItem.id ? {...newItem} : {...cat}));
    } else {
      updatedCategories = [...categories, {...newItem}];
    }

    setCategories(updatedCategories);
  }

  async function handleCreateCategory(obj) {
    try {
      const newItem = await performFetch("/categories/new", {method: 'POST', body: JSON.stringify(obj)});
      // const newItem = await fetch("http://192.168.15.12:3333/categories/new", {method: 'POST', body: JSON.stringify(obj)})
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      insertCategory(newItem);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  async function handleUpdateCategory(category) {
    try {
      const newItem = await performFetch("/categories/update", {method: 'PUT', body: JSON.stringify(category)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      insertCategory(newItem);

    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteCategory(id) {
    const url = "/categories/delete";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      debugger;
      const updatedCategories = categories.filter(cat => cat.id !== id.id);
      setCategories(updatedCategories);
    })
    .catch(e => handleOpenSnackBar("error", e.message, 3500))
    ;
  }

  return {
    categories, setCategories,
    selectedCategories, setSelectedCategories,
    categoriesFiltered, setCategoriesFiltered,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar
  }
}