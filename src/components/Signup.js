import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/Signup.css';
import goodBiteTitle from '../images/good-bite-title.png';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    phoneNumber: '',
    userType: '',
    businessNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('signup-body');
    return () => {
      document.body.classList.remove('signup-body');
    };
  }, []);

  useEffect(() => {
    const businessNumberGroup = document.getElementById('businessNumberGroup');
    if (formData.userType === 'owner') {
      businessNumberGroup.style.display = 'block';
    } else {
      businessNumberGroup.style.display = 'none';
    }
  }, [formData.userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === 'userType' && value !== 'owner' ? { businessNumber: '' } : {}),
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setErrors({});
    let hasError = false;

    if (!formData.userType) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userType: '사용자 유형을 선택해주세요.',
      }));
      hasError = true;
    }

    if (formData.userType === 'owner' && !formData.businessNumber) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessNumber: '사업자 등록 번호를 입력해주세요.',
      }));
      hasError = true;
    }

    if (!hasError) {
      const filteredUserData = { ...formData };
      if (formData.userType === 'customer') {
        delete filteredUserData.businessNumber;
      }
      delete filteredUserData.userType;

      let apiEndpoint;
      if (formData.userType === 'customer') {
        apiEndpoint = '/customers/signup';
      } else if (formData.userType === 'owner') {
        apiEndpoint = '/owners/signup';
      }

      try {
        const data = await fetchData(apiEndpoint, {
          method: 'POST',
          body: JSON.stringify(filteredUserData),
        });

        setMessage(`Signup successful: ${JSON.stringify(data)}`);
        alert('회원가입에 성공하였습니다.');
        navigate('/login');
      } catch (error) {
        setMessage(`Signup failed: ${error.message}`);
      }
    }
  };

  return (
      <div className="container">
        <div className="title">
          <Link to="/">
            <img src={goodBiteTitle} alt="GoodBite Title" className="title-image" />
          </Link>
        </div>
        <form id="signupForm" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
                id="email"
                name="email"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
                id="nickname"
                name="nickname"
                required
                type="text"
                value={formData.nickname}
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
                value={formData.password}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">휴대폰 번호</label>
            <input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="010-1234-5678"
                required
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="userType">사용자 유형</label>
            <select
                id="userType"
                name="userType"
                required
                value={formData.userType}
                onChange={handleChange}
            >
              <option value="">선택해주세요</option>
              <option value="customer">일반 사용자</option>
              <option value="owner">사업자</option>
              {/* <option value="admin">관리자</option> */}
            </select>
            {errors.userType && <div className="error-message">{errors.userType}</div>}
          </div>
          <div className="form-group" id="businessNumberGroup">
            <label htmlFor="businessNumber">사업자 등록 번호</label>
            <input
                id="businessNumber"
                name="businessNumber"
                placeholder="예: 123-45-67890"
                type="text"
                value={formData.businessNumber}
                onChange={handleChange}
                required={formData.userType === 'owner'}
            />
            {errors.businessNumber && <div className="error-message">{errors.businessNumber}</div>}
          </div>
          <button className="submit-btn" type="submit">회원가입</button>
        </form>
        {message && <p>{message}</p>}
      </div>
  );
}

export default Signup;