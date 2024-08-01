import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/good-bite-logo.png';
import '../styles/Home.css';
import {useUser} from "../UserContext";

const Home = () => {
  const { role } = useUser();

  useEffect(() => {
    console.log("현재 역할: ", role);
  }, [role]);

  return (
      <div className="home-container">
        <img src={logo} className="home-logo" alt="logo" />
        <p>Welcome to the GOOD BITE Project!</p>
        {!role && (
            <>
              <Link className="home-link" to="/signup">
                Sign up
              </Link>
              <Link className="home-link" to="/login">
                Sign in
              </Link>
            </>
        )}
        {role && (
            <>
              {role === 'ROLE_OWNER' && <Link className="home-link" to="/owners">Mypage</Link>}
              {role === 'ROLE_CUSTOMER' && <Link className="home-link" to="/customers">Mypage</Link>}
              <Link className="home-link" to="/waiting">
                Waiting
              </Link>
            </>
        )}
      </div>
  );
};

export default Home;
