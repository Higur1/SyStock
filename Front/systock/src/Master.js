import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { CategoryProvider } from './contexts/CategoryContext'
import { ProductProvider } from './contexts/ProductContext'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'

export default function Master() {
  return (

    <div style={{ margin: "16px" }}>
      <Routes>
        <CategoryProvider>
          <Route path="category" element={<Category />}
          />
          <Route path="product" element={
            <ProductProvider>
              <Product />
            </ProductProvider>} />

        </CategoryProvider>
      </Routes>

    </div>
  )
}
