import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import RestaurantList from "./RestaurantList";
import '../styles/App.css';
import UpdateCustomer from "./UpdateCustomer";
import UpdateOwner from "./UpdateOwner";
import {UserProvider}  from "../UserContext";
import CustomerMypage from "./CustomerMypage";
import OwnerMypage from "./OwnerMypage";

const App = () => {
return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/customers" element={<CustomerMypage />} />
        <Route path="/owners" element={<OwnerMypage />} />
        <Route path="/update-customer" element={<UpdateCustomer />} />
        <Route path="/update-owner" element={<UpdateOwner />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;
