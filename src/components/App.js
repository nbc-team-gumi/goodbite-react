import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import Dashboard from './Dashboard';
import RestaurantList from "./RestaurantList";
import CustomerWaitingList from './CustomerWaitingList';
import RegisterOperatingHour from "./RegisterOperatingHour";
import UpdateOperatingHour from "./UpdateOperatingHour";
import RestaurantDetail from "./RestaurantDetail";
import RegisterRestaurant from "./RegisterRestaurant";
import UpdateRestaurant from "./UpdateRestaurant";
import RegisterMenu from "./RegisterMenu";
import UpdateMenu from "./UpdateMenu";
import '../styles/App.css';
import OwnerRestaurantDetail from "./OwnerRestaurantDetail";
import UpdateCustomer from "./UpdateCustomer";
import UpdateOwner from "./UpdateOwner";
import {UserProvider}  from "../UserContext";
import CustomerMypage from "./CustomerMypage";
import OwnerMypage from "./OwnerMypage";
import DeactivateCustomer from "./DeactivateCustomer";
import DeactivateOwner from "./DeactivateOwner";
import Reservation from './Reservation';
import CustomerReservationList from './CustomerReservationList';

const App = () => {
  // 역할에 따라 리다이렉트할 경로 결정
  const getRedirectPath = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ROLE_OWNER') {
      return '/dashboard';
    }
    return '/restaurants';
  };

return (
    <UserProvider>
    <Router>
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}
        <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/register-operatinghour/:restaurantId" element={<RegisterOperatingHour />} />
        <Route path="/update-operatinghour/:operatingHourId" element={<UpdateOperatingHour />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/*<Route path="/restaurant-detail" element={<RestaurantDetail/>}/>*/}
        <Route path="/restaurants/:restaurantName" element={<RestaurantDetail />} /> {/* 동적 경로 설정 */}
        <Route path="/register-restaurant" element={<RegisterRestaurant/>}/>
        {/*<Route path="/update-restaurant" element={<UpdateRestaurant/>}/>*/}
        <Route path="/update-restaurant/:restaurantId" element={<UpdateRestaurant />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/owner-restaurant-detail/:restaurantId" element={<OwnerRestaurantDetail />} />
        <Route path="/owner-restaurant-detail" element={<OwnerRestaurantDetail />} />
        <Route path="/customers" element={<CustomerMypage />} />
        <Route path="/owners" element={<OwnerMypage />} />
        <Route path="/update-customer" element={<UpdateCustomer />} />
        <Route path="/update-owner" element={<UpdateOwner />} />
        <Route path="/delete-customer" element={<DeactivateCustomer />} />
        <Route path="/delete-owner" element={<DeactivateOwner />} />
        <Route path="/waitings" element={<CustomerWaitingList />} />
        <Route path="/register-menu/:restaurantId" element={<RegisterMenu />} />
        <Route path="/update-menu/:menuId" element={<UpdateMenu />} />
        <Route path="/restaurants/:restaurantId/reservation" element={<Reservation />} />
        <Route path="/reservations" element={<CustomerReservationList />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;
