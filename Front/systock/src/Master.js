import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Supplier from './pages/Supplier/Supplier'
import { MainContext } from './App'
import Login from './pages/Login/Login'
import ResetPassword from './pages/Login/ResetPassword/ResetPassword'
import Home from './pages/Home/Home'
import ProductPage from './pages/Product/ProductPage'

export default function Master() {
  return (
    <MainContext.Consumer>
      {({ isLoggedIn, actions }) => {

        return (
          <div style={{ padding: "0px", flex: isLoggedIn ? 0 : 1 }}>
            <Routes>
              <Route path="login" element={
                !isLoggedIn ? <Login /> : null
              }
              />
              <Route path="reset/password/:token" element={
                !isLoggedIn ? <ResetPassword/> : null
              }
              />
              <Route path="home" element={isLoggedIn ? <Home /> : null} />
              <Route path="categories" element={isLoggedIn ? <Category /> : null} />
              <Route path="products" element={isLoggedIn ? <ProductPage /> : null} />
              <Route path="suppliers" element={isLoggedIn ? <Supplier /> : null} />
            </Routes>
          </div>
        );
      }}
    </MainContext.Consumer>
  )
}
