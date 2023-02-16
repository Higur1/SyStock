import { useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState(['teste','teste 2','teste 3', 'TESTE INITIAL CATEGORY']);
  const [categorySelected, setCategory] = useState('TESTE INITIAL CATEGORY');

  function handleChange(e) {
    setCategory(e.target.value);
  }



  return {
    categories,
    setCategories,
    categorySelected,
    handleChange
  }
}