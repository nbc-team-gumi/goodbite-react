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
import RegisterMenu from "./RegisterMenu";
import UpdateMenu from "./UpdateMenu";
import '../styles/App.css';

const App = () => (
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
        <Route path="/register-menu" element={<RegisterMenu />} />
        <Route path="/update-menu" element={<UpdateMenu />} />
      </Routes>
    </Router>
);

export default App;
