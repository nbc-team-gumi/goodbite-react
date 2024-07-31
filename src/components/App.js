import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import '../styles/App.css';
import UpdateCustomer from "./UpdateCustomer";
import UpdateOwner from "./UpdateOwner";

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/customers/update" element={<UpdateCustomer />} />
        <Route path="/owners/update" element={<UpdateOwner />} />
        <Route path="/customers/delete" element={<UpdateOwner />} />
      </Routes>
    </Router>
);

export default App;
