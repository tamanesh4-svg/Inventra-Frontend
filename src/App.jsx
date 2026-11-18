import { useState } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductAnalytics from './pages/ProductAnalytics';
import OrderDetails from './pages/OrderDetails';
import RestockHistory from './pages/RestockHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
   <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/productanalytics" element={<ProductAnalytics />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/restock_history" element={<RestockHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
      
    </>
  )
}

export default App
