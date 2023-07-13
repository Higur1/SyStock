import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'
import Supplier from './pages/Supplier/Supplier'

export default function Master() {
  return (

    <div style={{ margin: "16px" }}>
      <Routes>
        <Route path="categories" element={<Category />}/>
        <Route path="products" element={<Product />}/>
        <Route path="suppliers" element={<Supplier />}/>
      </Routes>
    </div>
  )
}
