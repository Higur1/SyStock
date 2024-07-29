import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'
import Supplier from './pages/Supplier/Supplier'
import { LoginContext } from './App'
import Login from './pages/Login/Login'
import ResetPassword from './pages/Login/ResetPassword/ResetPassword'
import Home from './pages/Home/Home'

export default function Master() {
  return (
    <LoginContext.Consumer>
      {({ isLoggedIn, actions }) => {

        return (
          <div style={{ margin: isLoggedIn ? "16px" : "0px", flex: isLoggedIn ? 0 : 1, overflow: "auto" }}>
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
              <Route path="products" element={isLoggedIn ? <Product /> : null} />
              <Route path="suppliers" element={isLoggedIn ? <Supplier /> : null} />
            </Routes>
          </div>
        );
      }}
    </LoginContext.Consumer>
  )
}
