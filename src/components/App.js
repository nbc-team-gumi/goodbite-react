import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import RestaurantList from "./RestaurantList";
import CustomerWaitingList from './CustomerWaitingList';
import '../styles/App.css';

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/waitings" element={<CustomerWaitingList />} />
      </Routes>
    </Router>
);

export default App;
