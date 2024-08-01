import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import '../styles/App.css';
import UpdateCustomer from "./UpdateCustomer";
import UpdateOwner from "./UpdateOwner";
import { UserProvider } from './UserContext';

const App = () => {
return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/customers" element={<UpdateCustomer />} />
        <Route path="/owners" element={<UpdateOwner />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

const OwnerDashboard = () => <div>Owner Dashboard</div>;
const CustomerDashboard = () => <div>Customer Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const MyPage = () => <div>My Page</div>;
const Waiting = () => <div>Waiting</div>;

export default App;
