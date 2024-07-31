import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import Signup from '../components/Signup';
import Waiting from '../components/Waiting';
import Login from '../components/Login';
import logo from '../good-bite-logo.png';
import './App.css';

const Header = () => (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Welcome to the GOOD BITE Project!
      </p>
      <Link
          className="App-link"
          to="/signup"
      >
      Sign up
      </Link>

      <Link
          className="App-link"
          to="/waiting"
      >
        make waiting
      </Link>
    </header>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const isWaiting = location.pathname === '/waiting';

  return (
      <div className="App">
        {!isSignupPage && !isWaiting && <Header />}
        {children}
      </div>
  );
};

function App() {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/waiting" element={<Waiting />} />
            {/* 다른 경로를 추가할 수 있습니다. */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
  );
}

export default App;