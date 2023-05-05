import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, insertCategory } from "../redux/actions/categoriesActions";
import { deepCopy } from "../utils/utils";

export default function useCategory() {

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);

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
    handleCreateCategory
  }
}