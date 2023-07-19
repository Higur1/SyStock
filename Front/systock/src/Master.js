import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Product from './pages/Product/Product'
import Supplier from './pages/Supplier/Supplier'
import { LoginContext } from './App'
import Login from './pages/Login/Login'

export default function Master() {
  return (
    <LoginContext.Consumer>
      {({ isLoggedIn, actions }) => {

        return (
          <div style={{ margin: isLoggedIn ? "16px" : "0px", flex: isLoggedIn ? 0 : 1 }}>
            <Routes>
              <Route path="login" element={
                !isLoggedIn ? <Login setIsLoggedIn={actions.setIsLoggedIn}/> : null
              }
              />
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
