import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import Dashboard from './Dashboard';
import RestaurantList from "./RestaurantList";
import RegisterOperatingHour from "./RegisterOperatingHour";
import UpdateOperatingHour from "./UpdateOperatingHour";
import RestaurantDetail from "./RestaurantDetail";
import RegisterRestaurant from "./RegisterRestaurant";
import UpdateRestaurant from "./UpdateRestaurant";
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
        <Route path="/register-operatinghour" element={<RegisterOperatingHour />} />
        <Route path="/update-operatinghour" element={<UpdateOperatingHour />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/*<Route path="/restaurant-detail" element={<RestaurantDetail/>}/>*/}
        <Route path="/restaurants/:restaurantName" element={<RestaurantDetail />} /> {/* 동적 경로 설정 */}
        <Route path="/register-restaurant" element={<RegisterRestaurant/>}/>
        <Route path="/update-restaurant" element={<UpdateRestaurant/>}/>
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
