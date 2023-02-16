import React from 'react'
import { createBrowserRouter, Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'

export default function Master() {
  return (
    
    <>
      <Routes>
        <Route path="category" element={<Category />}/>
        <Route path="product" element={<Product />}/>

        
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Routes>
      
    </>
  )
}
