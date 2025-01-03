import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Supplier from './pages/Supplier/Supplier'
import { MainContext } from './App'
import Login from './pages/Login/Login'
import ResetPassword from './pages/Login/ResetPassword/ResetPassword'
import Home from './pages/Home/Home'
import ProductPage from './pages/Product/ProductPage'
import HistoryPage from './pages/History/HistoryPage'
import SellRegistersPage from './pages/SellRegisters/SellRegistersPage'
import SettingsPage from './pages/Settings/SettingsPage'
import SupportPage from './pages/Support/SupportPage'

export default function Master() {
  return (
    <MainContext.Consumer>
      {({ isLoggedIn }) => {

        return (
          <div style={{ padding: "0px", flex: isLoggedIn ? 0 : 1, position: 'relative' }}>
            {isLoggedIn && <SupportPage />}
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
              <Route path="history" element={isLoggedIn ? <HistoryPage /> : null} />
              <Route path="sellRegisters" element={isLoggedIn ? <SellRegistersPage /> : null} />
              <Route path="settings" element={isLoggedIn ? <SettingsPage /> : null} />
            </Routes>
          </div>
        );
      }}
    </MainContext.Consumer>
  )
}
