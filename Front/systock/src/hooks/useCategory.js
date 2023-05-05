import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/actions/categoriesActions";

export default function useCategory() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getCategories());
  // });

  const categoryRedux = useSelector(state => state.categories);

  const [categories, setCategories] = useState([
    {id: 0, label: 'Garrafa', quantity: '4235', parent: null},
    {id: 1, label: 'Potes', quantity: '67523', parent: null},
    {id: 2, label: 'Copos', quantity: '5432', parent: null},
    {id: 3, label: 'Garfos', quantity: '35245', parent: null},
  ]);
  const [selectedCategories, setselectedCategories] = useState([]);
  const [categoriesFiltered, setCategoriesFiltered] = useState([]);


  //* HANDLE WHEN AUTOCOMPLETE
  //* CATEGORY SCREEN
  function handleSelectedOptions(newValue) {
    setselectedCategories(newValue);
  }

  //* UPDATE CATEGORY LIST WHEN CHOOSE
  useEffect(() => {
    let filteredOptions = [];
  
    for (let i = 0; i < selectedCategories.length; i++) {
      filteredOptions = [...filteredOptions, ...categories.filter(cat => cat.label === selectedCategories[i])];
    }
    if(!filteredOptions.length) {
      setCategoriesFiltered(categories);
    } else {
      setCategoriesFiltered(filteredOptions);
    }
  }, [selectedCategories, categories]);

  //* HANDLE CREATE CATEGORY
  function handleCreateCategory(categoryName, categoryParent) {

    setCategories([...categories, {
      id: categories.length,
      label: categoryName,
      quantity: 0,
      parent: categoryParent === '' ? null : categoryParent
    }]);
  }

  return {
    categoryRedux,
    categories,
    setCategories,
    selectedCategories,
    handleSelectedOptions,
    categoriesFiltered,
    handleCreateCategory
  }
}