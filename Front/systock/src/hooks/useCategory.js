import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([
    {id: 0, label: 'Garrafa', quantity: '4235', father: null},
    {id: 1, label: 'Potes', quantity: '67523', father: null},
    {id: 2, label: 'Copos', quantity: '5432', father: null},
    {id: 3, label: 'Garfos', quantity: '35245', father: null},
  ]);
  
  const [selectedCategories, setselectedCategories] = useState([]);

  const [categoriesFiltered, setCategoriesFiltered] = useState([]);

  //* HANDLE WHEN AUTOCOMPLETE
  //* CATEGORY SCREEN
  function handleSelectedOptions(newValue) {
    setselectedCategories(newValue);
  }

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
  }, [selectedCategories]);




  return {
    categories,
    setCategories,
    selectedCategories,
    handleSelectedOptions,
    categoriesFiltered
  }
}