/* eslint-disable no-debugger */
import { useContext, useEffect, useRef, useState } from "react";
import { deepCopy } from "../utils/utils";
import { DEBUG_LOCAL, MainContext } from "../App";
import { ENTITIES } from "../utils/debug-local-helper";
import CategoryActions from "../Service/Category/CategoryActions";

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
    getCategories();
  }, []);

  function handleMenuOptions(id) {
    setMenuOptions(!menuOption);
    setIdMenu(id);
  }

  async function getCategories() {
    if(DEBUG_LOCAL) {
      const categArr = getData(ENTITIES.CATEGORIES);

      return setTimeout(() => setCategories(categArr), 350);
    }
    try {
      const categories = await CategoryActions.getAll();
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
        const nextArr = prevState.map(cat => (cat.id === newItem.id ? {...newItem} : {...cat}));
        if(DEBUG_LOCAL) updateData(ENTITIES.CATEGORIES, nextArr);
        return nextArr;
      } else {
        const nextArr = [...prevState, newItem];
        if(DEBUG_LOCAL) updateData(ENTITIES.CATEGORIES, nextArr);
        return nextArr;
      }
    });
    
    handleOpenSnackBar("success", "Categoria adicionada com sucesso!!", 3500);
  }

  /**
   * * create category
   * @param {*} 
   */
  async function handleCreateCategory(obj) {
    if(DEBUG_LOCAL) return insertCategory(obj);     

    try {
      const newItem = await CategoryActions.create(obj);

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
    if(DEBUG_LOCAL) return insertCategory(category);     
    try {
      const newItem = await CategoryActions.update(category);
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
  async function handleDeleteCategory(category) {
    if(DEBUG_LOCAL) {
      const updatedCategories = categories.filter(cat => cat.id !== category.id);
      setCategories(updatedCategories);
      return updateData(ENTITIES.CATEGORIES, updatedCategories);
    }

    try {
      await CategoryActions.delete(category);

      handleOpenSnackBar("success", "Categoria deletada com sucesso!!", 3500);
      const updatedCategories = categories.filter(cat => cat.id !== category.id);
      setCategories(updatedCategories);
    } catch (e) {
      handleOpenSnackBar("error", e.message, 3500);
    }
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