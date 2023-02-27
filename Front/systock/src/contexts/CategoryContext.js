import React, { createContext } from "react";
import useCategory from "../hooks/useCategory";

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const {
    categories,
    setCategories,
    selectedCategories,
    handleSelectedOptions,
    categoriesFiltered,
    handleCreateCategory
  } = useCategory();

  return (
    <CategoryContext.Provider value={{
      categories,
      setCategories,
      selectedCategories,
      handleSelectedOptions,
      categoriesFiltered,
      handleCreateCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
}