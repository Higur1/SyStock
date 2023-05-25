import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, insertCategory, updateCategory } from "../redux/actions/categoriesActions";
import { deepCopy } from "../utils/utils";
import { performFetch } from "../apiBase";

export default function useCategory() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);
  const [message, setMessage] = useState("");

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
      if(typeof newItem === 'string') {
        setMessage(newItem);
        return;
      }

      insertCategory(newItem);

    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateCategory(category) {
    try {
      const newItem = await performFetch("/categories/update", {method: 'PUT', body: JSON.stringify(category)});
      
      if(typeof newItem === 'string') {
        setMessage(newItem);
        return;
      }

      insertCategory(newItem);

    } catch (error) {
      setMessage(error.message);
    }
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteCategory(id) {
    const url = "/categories/delete";

    try {
      await performFetch(url, {method: 'DELETE', body: JSON.stringify(id)});

      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return {
    categories, setCategories,
    selectedCategories, setSelectedCategories,
    categoriesFiltered, setCategoriesFiltered,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory,
    message
  }
}