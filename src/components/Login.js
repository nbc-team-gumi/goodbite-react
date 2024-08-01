import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import {Link, useNavigate} from 'react-router-dom';
import { fetchData } from '../util/api';
import goodBiteTitle from '../images/good-bite-title.png';
import { useUser } from '../UserContext';//추가

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setRole } = useUser();//추가

  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetchData('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log("response: ", response);

      // 응답 데이터가 올바른지 확인합니다.
      if (!response.role) {
        throw new Error("응답 데이터에 역할 정보가 없습니다.");
      }

      // 역할 정보를 Context에 저장합니다
      setRole(response.role);

      alert('로그인에 성공했습니다!');
      setEmail('');
      setPassword('');
      if (response.role === 'ROLE_OWNER') {
        navigate('/dashboard');
      } else if (response.role === 'ROLE_CUSTOMER') {
        navigate('/restaurants');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(`로그인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
      <div className="login-container">
        <div className="logo">
          <Link to="/">
            <img src={goodBiteTitle} alt="GoodBite Title" className="title-image-login" />
          </Link>
        </div>
        <h1>로그인</h1>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
                id="email"
                name="email"
                required
                type="email"
                value={email}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
                id="password"
                name="password"
                required
                type="password"
                value={password}
                onChange={handleChange}
            />
          </div>
          <button className="login-btn" type="submit">로그인</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <div className="links">
          <a href="/forgot-password">비밀번호를 잊으셨나요?</a> | <a href="/signup">회원가입</a>
        </div>
      </div>
  );
};

export default Login;
