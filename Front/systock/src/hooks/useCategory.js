/* eslint-disable no-debugger */
import { useEffect, useRef, useState } from "react";
import { deepCopy } from "../utils/utils";
import { performFetch, performFetchNoResult } from "../apiBase";

export default function useCategory() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [menuOption, setMenuOptions] = useState(false);
  const [idMenu, setIdMenu] = useState(null);
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);

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

  function handleMenuOptions(id) {
    setMenuOptions(!menuOption);
    setIdMenu(id);
  }

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

  /**
   * * insert category on state
   * @param {*} category 
   */
  const insertCategory = (newCategory) => {
    const newItem = deepCopy(newCategory);

    setCategories(prevState => {
      if(prevState.some(cat => cat.id === newItem.id)) {
        return prevState.map(cat => (cat.id === newItem.id ? {...newItem} : {...cat}));
      } else {
        return [...prevState, newItem];
      }
    });
    
    handleOpenSnackBar("success", "Categoria adicionada com sucesso!!", 3500);
  }

  /**
   * * create category
   * @param {*} 
   */
  async function handleCreateCategory(obj) {
    try {
      const newItem = await performFetch("/category", {method: 'POST', body: JSON.stringify(obj)});
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, null);
        return;
      }

      insertCategory(newItem);
      setOpenCreateCategory(false);
    } catch (error) {
      handleOpenSnackBar("error", error.message, null);
    }
  }

  /**
   * * update category
   * @param {*} 
   */
  async function handleUpdateCategory(category) {
    try {
      const newItem = await performFetch("/category", {method: 'PUT', body: JSON.stringify(category)});
      
      if(typeof newItem === 'string') {
        handleOpenSnackBar("error", newItem, 3500);
        return;
      }

      insertCategory(newItem);

      handleOpenSnackBar("success", "Categoria atualizada com sucesso!!", 3500);
    } catch (error) {
      handleOpenSnackBar("error", error.message, 3500);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteCategory(id) {
    const url = "/category";

    performFetchNoResult(url, {method: 'DELETE', body: JSON.stringify(id)})
    .then(() => {
      const updatedCategories = categories.filter(cat => cat.id !== id.id);
      setCategories(updatedCategories);
      
    handleOpenSnackBar("success", "Categoria apagada com sucesso!!", 3500);
    })
    .catch(e => handleOpenSnackBar("error", e.message, 3500))
    ;
  }

  return {
    categories, setCategories,
    selectedCategories, setSelectedCategories,
    categoriesFiltered, setCategoriesFiltered,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    handleCloseSnackBar, openSnackBar, autoHideSnackBar, snackMessageSnackBar, severitySnackBar,
    openCreateCategory, setOpenCreateCategory,
    menuOption, setMenuOptions,
    idMenu, setIdMenu,
    editCategory, setEditCategory,
    deleteCategory, setDeleteCategory,
    handleMenuOptions
  }
}