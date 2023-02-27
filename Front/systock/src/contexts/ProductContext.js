import React, { createContext } from "react";
import useCategory from "../hooks/useCategory";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  // get useProduct

  return (
    <ProductContext.Provider value={{

    }}>
      {children}
    </ProductContext.Provider>
  );
}