import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Waiting from './Waiting';
import '../styles/App.css';
import RegisterOperatingHour from "./RegisterOperatingHour";
import UpdateOperatingHour from "./UpdateOperatingHour";

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/register-operatinghour" element={<RegisterOperatingHour />} />
        <Route path="/update-operatinghour" element={<UpdateOperatingHour />} />
      </Routes>
    </Router>
);

export default App;
