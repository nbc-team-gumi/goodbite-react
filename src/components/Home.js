import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/good-bite-logo.png';
import '../styles/Home.css';

const Home = () => (
    <div className="home-container">
      <img src={logo} className="home-logo" alt="logo" />
      <p>Welcome to the GOOD BITE Project!</p>
      <Link className="home-link" to="/signup">
        Sign up
      </Link>
      <Link className="home-link" to="/login">
        Sign in
      </Link>
      <Link className="home-link" to="/waiting">
        Waiting
      </Link>
      <Link className="home-link" to="/waitings">
        waiting-list
      </Link>
    </div>
);

export default Home;
