import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/good-bite-logo.png';
import '../styles/Home.css';
import {useUser} from "../UserContext";

const Home = () => {
  const { user } = useUser();

  return (
      <div className="home-container">
        <img src={logo} className="home-logo" alt="logo" />
        <p>Welcome to the GOOD BITE Project!</p>
        {!user && (
            <>
              <Link className="home-link" to="/signup">
                Sign up
              </Link>
              <Link className="home-link" to="/login">
                Sign in
              </Link>
            </>
        )}
        {user && (
            <>
              {user.type === 'OWNER' && <Link className="home-link" to="/owner-dashboard">Owner Dashboard</Link>}
              {user.type === 'CUSTOMER' && <Link className="home-link" to="/customer-dashboard">Customer Dashboard</Link>}
              {user.type === 'ADMIN' && <Link className="home-link" to="/admin-dashboard">Admin Dashboard</Link>}
              <Link className="home-link" to="/mypage">
                MyPage
              </Link>
              <Link className="home-link" to="/waiting">
                Waiting
              </Link>
            </>
        )}
      </div>
  );
};

export default Home;
