import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link
} from 'react-router-dom';
import Signup from '../components/Signup';
import logo from '../good-bite-logo.png';
import './App.css';
import RegisterRestaurant from "../components/RegisterRestaurant";
import RestaurantDetail from "../components/RestaurantDetail";

const Header = () => (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>
        Welcome to the GOOD BITE Project!
      </p>
      <Link
          className="App-link"
          to="/signup"
      >
        Sign up
      </Link>
    </header>
);

const Layout = ({children}) => {
  const location = useLocation();
  const isHeaderVisible = location.pathname !== '/signup'
      && location.pathname !== '/register-restaurant'
      && location.pathname !== '/restaurant-detail';

  return (
      <div className="App">
        {isHeaderVisible && <Header/>}
        {children}
      </div>
  );
};

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/register-restaurant" element={<RegisterRestaurant/>}/>
            <Route path="/restaurant-detail" element={<RestaurantDetail/>}/>
            {/* 다른 경로를 추가할 수 있습니다. */}
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;