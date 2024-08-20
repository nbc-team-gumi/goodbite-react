import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../util/api';
import '../styles/Signup.css';
import goodBiteTitle from '../images/good-bite-title.png';
import styled from "styled-components";

const Asterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

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

    setFormData((prevFormData) => {
      const updatedValue = name === 'businessNumber' ? value.replace(/-/g, '') : value;
      return {
        ...prevFormData,
        [name]: updatedValue,
        ...(name === 'userType' && value !== 'owner' ? { businessNumber: '' } : {}),
      };
    });
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
            <img src={goodBiteTitle} alt="GoodBite Title" className="title-image-login" />
          </Link>
        </div>
        <form id="signupForm" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="email"><Asterisk>*</Asterisk> 이메일</label>
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
            <label htmlFor="nickname"><Asterisk>*</Asterisk> 닉네임</label>
            <input
                id="nickname"
                name="nickname"
                placeholder="2글자 이상 20자 이하"
                required
                type="text"
                value={formData.nickname}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"><Asterisk>*</Asterisk> 비밀번호</label>
            <input
                id="password"
                name="password"
                placeholder="8글자 이상 15글자 이하, 알파벳 대소문자, 숫자, 특수문자로 구성"
                required
                type="password"
                value={formData.password}
                onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber"><Asterisk>*</Asterisk> 휴대폰 번호</label>
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
            <label htmlFor="userType"><Asterisk>*</Asterisk> 사용자 유형</label>
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
            </select>
            {errors.userType && <div className="error-message">{errors.userType}</div>}
          </div>
          <div className="form-group" id="businessNumberGroup">
            <label htmlFor="businessNumber"><Asterisk>*</Asterisk> 사업자 등록 번호</label>
            <input
                id="businessNumber"
                name="businessNumber"
                placeholder="사업자 등록 번호 10자리"
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