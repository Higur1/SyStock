import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'

export default function Master() {
  return (

    <div style={{ margin: "16px" }}>
      <Routes>

        <Route path="category" element={<Category />}/>
        <Route path="product" element={<Product />}/>
      </Routes>

    </div>
  )
}
