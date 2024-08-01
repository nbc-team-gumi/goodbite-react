import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import RestaurantList from "./RestaurantList";
import '../styles/App.css';
import RestaurantDetail from "./RestaurantDetail";
import RegisterRestaurant from "./RegisterRestaurant";
import UpdateRestaurant from "./UpdateRestaurant";

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/restaurant-detail" element={<RestaurantDetail/>}/>
        <Route path="/register-restaurant" element={<RegisterRestaurant/>}/>
        <Route path="/update-restaurant" element={<UpdateRestaurant/>}/>
        <Route path="/restaurants" element={<RestaurantList />} />
      </Routes>
    </Router>
);

export default App;
