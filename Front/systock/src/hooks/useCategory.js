import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, insertCategory, updateCategory } from "../redux/actions/categoriesActions";
import { deepCopy } from "../utils/utils";

export default function useCategory() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const categoriesRedux = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if(categoriesRedux.items.length === 0) return;

    const newCategories = deepCopy(categoriesRedux.items); //* deep copy
    setCategories(newCategories);
  }, [categoriesRedux.items]);


  //* UPDATE CATEGORY LIST WHEN CHOOSE
  useEffect(() => {
    if(categories.length === 0) return;

    let filteredOptions = categories.filter(cat => selectedCategories.some(catSelected => catSelected === cat.name));

    setCategoriesFiltered(selectedCategories.length === 0 ? categories : filteredOptions);

  }, [selectedCategories, categories]);

  function handleCreateCategory(obj) {
    dispatch(insertCategory(obj));
  }

  function handleUpdateCategory(category) {
    dispatch(updateCategory(category));
  }

  /**
   * * delete category by id
   * @param {*} id 
   */
  async function handleDeleteCategory(id) {
    const url = "/categories/delete";

    try {
      performFetch(url, {method: 'DELETE', body: JSON.stringify(id)});

      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);
    } catch (e) {
      setMessage(e.message);
    }
  }

  /**
   * * when add a category
   */
  useEffect(() => {
    if(Object.values(categoriesRedux.itemAdded).length === 0) return;

    const newItem = deepCopy(categoriesRedux.itemAdded);
    let updatedCategories = [];
    if(categories.some(cat => cat.id === newItem.id)) {
      updatedCategories = categories.map(cat => (cat.id === newItem.id ? {...newItem} : {...cat}));
    } else {
      updatedCategories = [...categories, {...newItem}];
    }

    setCategories(updatedCategories);

  }, [categoriesRedux.itemAdded]);

  return {
    categories, setCategories,
    selectedCategories, setSelectedCategories,
    categoriesFiltered, setCategoriesFiltered,
    categoriesRedux,
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory
  }
}