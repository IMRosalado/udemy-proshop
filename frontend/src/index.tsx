import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Provider } from 'react-redux';
import store from "./store";
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PrivateRoute from './components/PrivateRoute';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ProfileScreen from './screens/ProfileScreen';
import AdminRoute from './components/AdminRoute';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import EditProductScreen from './screens/admin/EditProductScreen';
import UserListScreen from './screens/admin/UserListScreen';
import EditUserScreen from './screens/admin/EditUserScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      <Route index={true} path="/" element={<HomeScreen/>}/>
      <Route path="/search/:keyword" element={<HomeScreen/>}/>
      <Route path="/page/:pageNumber" element={<HomeScreen/>}/>
      <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen/>}/>
      <Route path="/product/:id" element={<ProductScreen/>}/>
      <Route path="/cart" element={<CartScreen/>}/>
      <Route path="/login" element={<LoginScreen/>}/>
      <Route path="/register" element={<RegisterScreen/>}/>
      
      <Route path="" element={<PrivateRoute/>}>
        <Route path="/shipping" element={<ShippingScreen/>}/>
        <Route path="/payment" element={<PaymentScreen/>}/>
        <Route path="/placeorder" element={<PlaceOrderScreen/>}/>
        <Route path="/orders/:id" element={<OrderScreen/>}/>
        <Route path="/profile" element={<ProfileScreen/>}/>
      </Route>

      <Route path="" element={<AdminRoute/>}>
        <Route path="/admin/orders" element={<OrderListScreen/>}/>
        <Route path="/admin/products" element={<ProductListScreen/>}/>
        <Route path="/admin/products/page/:pageNumber" element={<ProductListScreen/>}/>
        <Route path="/admin/products/:id/edit" element={<EditProductScreen/>}/>
        <Route path="/admin/users" element={<UserListScreen/>}/>
        <Route path="/admin/users/:id/edit" element={<EditUserScreen/>}/>
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true} options={{clientId:''}}>
          <RouterProvider router={router}/>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
